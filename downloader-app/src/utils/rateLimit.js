// Rate limiting middleware for API routes
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

// In-memory storage for rate limiting
const rateLimitStore = new Map();

/**
 * Clean up expired entries from the rate limit store
 */
const cleanupExpiredEntries = () => {
    const now = Date.now();
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now > data.resetTime) {
            rateLimitStore.delete(ip);
        }
    }
};

/**
 * Rate limiting middleware function
 * @param {Object} request - Next.js request object
 * @returns {Object} Response with rate limit headers if exceeded, null if allowed
 */
export const rateLimit = (request) => {
    // Clean up expired entries periodically
    if (Math.random() < 0.1) { // 10% chance to cleanup on each call
        cleanupExpiredEntries();
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';

    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    // Get existing data for this IP
    const existingData = rateLimitStore.get(ip);
    
    if (!existingData) {
        // First request from this IP in the window
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW_MS
        });
        return null; // Allow request
    }
    
    if (now > existingData.resetTime) {
        // Window has reset for this IP
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW_MS
        });
        return null; // Allow request
    }
    
    if (existingData.count >= MAX_REQUESTS_PER_WINDOW) {
        // Rate limit exceeded
        const resetTime = Math.ceil((existingData.resetTime - now) / 1000);
        return {
            status: 429,
            headers: {
                'Retry-After': resetTime.toString(),
                'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': existingData.resetTime.toString()
            }
        };
    }
    
    // Increment counter and allow request
    existingData.count += 1;
    rateLimitStore.set(ip, existingData);
    
    return null; // Allow request
};

/**
 * Get rate limit info for monitoring purposes
 * @param {string} ip - IP address
 * @returns {Object} Rate limit data for the IP
 */
export const getRateLimitInfo = (ip) => {
    const data = rateLimitStore.get(ip);
    if (!data) {
        return {
            count: 0,
            remaining: MAX_REQUESTS_PER_WINDOW,
            resetTime: null
        };
    }
    
    const now = Date.now();
    if (now > data.resetTime) {
        return {
            count: 0,
            remaining: MAX_REQUESTS_PER_WINDOW,
            resetTime: null
        };
    }
    
    return {
        count: data.count,
        remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - data.count),
        resetTime: data.resetTime
    };
};

export default rateLimit;