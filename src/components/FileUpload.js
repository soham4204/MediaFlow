import React, { useState } from 'react';
import { uploadToS3 } from '../services/s3';
import { processImage } from '../services/api';
import { FiUpload, FiDownload, FiImage, FiX, FiCheck } from 'react-icons/fi';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [resizedUrl, setResizedUrl] = useState('');
    const [apiResponse, setApiResponse] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationId, setNotificationId] = useState(0);

    // Function to show notification
    const showNotification = (message, type = 'success') => {
        const id = notificationId;
        setNotificationId(prev => prev + 1);
        
        setNotifications(prev => [...prev, { id, message, type }]);
        
        // Auto-hide notification after 4 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        }, 4000);
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Show notification when file is selected
            showNotification(`File "${selectedFile.name}" successfully selected!`, 'info');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setIsUploading(true);
        setProgress(0);
        
        try {
            // Step 1: Upload original image
            const s3Response = await uploadToS3(file, (progress) => {
                setProgress(Math.round(progress.loaded / progress.total * 50));
            });
            
            // Show notification for successful upload
            showNotification(`File "${file.name}" successfully uploaded!`, 'success');
            
            // Step 2: Resize the image via Lambda/API Gateway
            const apiResponse = await processImage(s3Response.key, '200x200', (apiProgress) => {
              setProgress(50 + Math.round(apiProgress * 50));
            });
            
            setApiResponse(apiResponse); // Store the full response
            setResizedUrl(apiResponse.url);
            
            // Show notification for successful resize
            showNotification('Image successfully resized to 200x200!', 'success');
            
            console.log('Resized image URL:', apiResponse.url);
        } catch (error) {
            console.error('Upload failed:', error);
            showNotification(`Error: ${error.message || 'Upload failed'}`, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const downloadImage = () => {
        if (!resizedUrl) return;
        
        // Use the stored apiResponse
        if (apiResponse?.downloadUrl) {
            window.location.href = apiResponse.downloadUrl;
            return;
        }
        
        // Fallback to direct download
        const link = document.createElement('a');
        link.href = resizedUrl;
        link.download = resizedUrl.split('/').pop() || 'resized-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show download notification
        showNotification('Download started!', 'info');
    };

    // Function to dismiss notification manually
    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative">
            {/* Notification container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {notifications.map((notification) => (
                    <div 
                        key={notification.id}
                        className={`flex items-center justify-between p-3 px-4 rounded-md shadow-lg min-w-64 transform transition-all duration-300 ease-in-out animate-slideIn ${
                            notification.type === 'error' 
                                ? 'bg-red-500 text-white' 
                                : notification.type === 'info'
                                ? 'bg-blue-500 text-white'
                                : 'bg-green-500 text-white'
                        }`}
                        style={{animation: 'slideIn 0.3s ease-out'}}
                    >
                        <div className="flex items-center">
                            {notification.type === 'error' ? (
                                <div className="mr-2 rounded-full bg-white bg-opacity-25 p-1">
                                    <FiX className="w-4 h-4" />
                                </div>
                            ) : (
                                <div className="mr-2 rounded-full bg-white bg-opacity-25 p-1">
                                    <FiCheck className="w-4 h-4" />
                                </div>
                            )}
                            <span className="font-medium">{notification.message}</span>
                        </div>
                        <button 
                            onClick={() => dismissNotification(notification.id)}
                            className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Image Resizer</h2>
            
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label 
                        htmlFor="file-upload" 
                        className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <FiImage className="w-8 h-8 text-indigo-500 mb-2" />
                        <span className="text-sm text-gray-600 mb-1">
                            {file ? file.name : 'Click to select an image'}
                        </span>
                        <span className="text-xs text-gray-400">
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'JPG, PNG, GIF up to 10MB'}
                        </span>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
                
                <button 
                    type="submit" 
                    disabled={!file || isUploading}
                    className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                        !file || isUploading 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    {isUploading ? (
                        <>Processing... {progress}%</>
                    ) : (
                        <>
                            <FiUpload className="w-5 h-5 mr-2" />
                            Upload & Resize
                        </>
                    )}
                </button>
            </form>
            
            {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
            
            {resizedUrl && (
                <div className="mt-8 flex flex-col items-center border-t pt-6 border-gray-200">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Resized Image (200x200)</h4>
                    <div className="relative mb-4 p-1 border border-gray-200 rounded-lg shadow-sm">
                        <img 
                            src={resizedUrl} 
                            alt="Resized version"
                            className="w-48 h-48 object-cover rounded"
                        />
                    </div>
                    <button 
                        onClick={downloadImage} 
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Download Image
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default FileUpload;

