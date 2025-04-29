const API_URL = 'https://puz6atbo90.execute-api.eu-north-1.amazonaws.com/prod';

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