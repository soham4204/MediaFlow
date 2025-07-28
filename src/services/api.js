const API_URL = process.env.REACT_APP_API_URL; // Replace with your actual API URL

export const processImage = async (imageKey, size) => {
    try {
        const params = new URLSearchParams({
            key: imageKey,
            size: size || '200x200'
        });

        const response = await fetch(`${API_URL}/resize?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to resize image');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(error.message || 'Failed to process image');
    }
};