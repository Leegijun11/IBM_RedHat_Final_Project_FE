export const getImageUrl = (path) => {
    if (!path) return null;
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
};