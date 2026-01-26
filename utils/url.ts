export const getSiteUrl = () => {
    // Check for Vercel's automatic environment variable or a manual override
    if (import.meta.env.VITE_SITE_URL) {
        return import.meta.env.VITE_SITE_URL;
    }

    // Fallback to window.location.origin which works for both localhost and deployed URLs
    // as long as the code runs in the browser
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    return 'http://localhost:5173'; // Default fallback
};
