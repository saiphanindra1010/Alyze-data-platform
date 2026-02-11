/**
 * Secure Authentication API Service
 * Handles authentication with httpOnly cookies and CSRF protection
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_BEAPI || 'http://localhost:5000';

// Create axios instance with credentials
const authApi = axios.create({
    baseURL: `${API_URL}/auth`,
    withCredentials: true, // Essential for httpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create general API instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// CSRF token storage
let csrfToken = null;

/**
 * Get CSRF token from cookie or storage
 */
const getCSRFToken = () => {
    // Try to get from cookie first
    const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf-token='))
        ?.split('=')[1];

    return cookieToken || csrfToken;
};

/**
 * Set CSRF token from response
 */
const setCSRFToken = (token) => {
    csrfToken = token;
};

/**
 * Add CSRF token to request headers
 */
const addCSRFHeader = (config) => {
    const token = getCSRFToken();
    if (token) {
        config.headers['X-CSRF-Token'] = token;
    }
    return config;
};

// Request interceptor - add CSRF token
api.interceptors.request.use(addCSRFHeader, (error) => Promise.reject(error));
authApi.interceptors.request.use(addCSRFHeader, (error) => Promise.reject(error));

// Response interceptor - handle token refresh
const handleTokenRefresh = async (error) => {
    const originalRequest = error.config;

    // If token expired, try to refresh
    if (error.response?.status === 401 &&
        error.response?.data?.code === 'TOKEN_EXPIRED' &&
        !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshResult = await authApi.post('/refresh');

            if (refreshResult.data?.csrfToken) {
                setCSRFToken(refreshResult.data.csrfToken);
                originalRequest.headers['X-CSRF-Token'] = refreshResult.data.csrfToken;
            }

            // Retry the original request
            return api(originalRequest);
        } catch (refreshError) {
            // Refresh failed, redirect to login
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
};

// Apply to both instances
api.interceptors.response.use(
    (response) => {
        if (response.data?.csrfToken) setCSRFToken(response.data.csrfToken);
        return response;
    },
    handleTokenRefresh
);

authApi.interceptors.response.use(
    (response) => {
        if (response.data?.csrfToken) setCSRFToken(response.data.csrfToken);
        return response;
    },
    handleTokenRefresh
);

/**
 * Authentication Service
 */
export const AuthService = {
    /**
     * Google OAuth login
     */
    googleLogin: async (code) => {
        const response = await authApi.get(`/google?code=${code}`);

        if (response.data?.csrfToken) {
            setCSRFToken(response.data.csrfToken);
        }

        return response.data;
    },

    /**
     * Refresh access token
     */
    refreshToken: async () => {
        const response = await authApi.post('/refresh');

        if (response.data?.csrfToken) {
            setCSRFToken(response.data.csrfToken);
        }

        return response.data;
    },

    /**
     * Logout from current device
     */
    logout: async () => {
        try {
            await authApi.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local state
            csrfToken = null;
            // Redirect to login
            window.location.href = '/login';
        }
    },

    /**
     * Logout from all devices
     */
    logoutAll: async () => {
        try {
            await authApi.post('/logout-all');
        } catch (error) {
            console.error('Logout all error:', error);
        } finally {
            csrfToken = null;
            window.location.href = '/login';
        }
    },

    /**
     * Validate current session
     */
    validateSession: async () => {
        try {
            const response = await authApi.get('/session');
            return { valid: true, user: response.data.user };
        } catch (error) {
            return { valid: false, error: error.response?.data?.code || 'UNKNOWN_ERROR' };
        }
    },

    /**
     * Get fresh CSRF token
     */
    getCSRF: async () => {
        const response = await authApi.get('/csrf');
        if (response.data?.csrfToken) {
            setCSRFToken(response.data.csrfToken);
        }
        return response.data.csrfToken;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: async () => {
        try {
            const result = await AuthService.validateSession();
            return result.valid;
        } catch {
            return false;
        }
    },
};

/**
 * Secure API wrapper with automatic CSRF and refresh handling
 */
export const SecureAPI = {
    get: (url, config = {}) => api.get(url, config),
    post: (url, data, config = {}) => api.post(url, data, config),
    put: (url, data, config = {}) => api.put(url, data, config),
    patch: (url, data, config = {}) => api.patch(url, data, config),
    delete: (url, config = {}) => api.delete(url, config),
};

// Legacy export for backward compatibility
export const googleAuth = (code) => AuthService.googleLogin(code);

export default AuthService;
