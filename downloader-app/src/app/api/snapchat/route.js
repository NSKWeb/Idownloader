import { getDownloadUrl, VideoProcessingError } from '@/utils/downloader';
import { NextResponse } from 'next/server';
import logger from '@/utils/logger';
import { rateLimit } from '@/utils/rateLimit';

export async function POST(request) {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request);
    if (rateLimitResult) {
        return NextResponse.json(
            { success: false, error: 'Rate limit exceeded. Please try again later.' },
            { 
                status: rateLimitResult.status,
                headers: rateLimitResult.headers
            }
        );
    }

    // Validate Content-Type header
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        logger.warn(`Invalid Content-Type header: ${contentType}`, { ip: request.headers.get('x-forwarded-for') });
        return NextResponse.json(
            { success: false, error: 'Content-Type must be application/json' },
            { status: 400 }
        );
    }

    let url;
    try {
        const body = await request.json();
        url = body.url;
    } catch (error) {
        logger.warn('Failed to parse JSON body', { 
            error: error.message, 
            ip: request.headers.get('x-forwarded-for') 
        });
        return NextResponse.json(
            { success: false, error: 'Invalid JSON in request body' },
            { status: 400 }
        );
    }

    // Validate URL field
    if (!url) {
        return NextResponse.json(
            { success: false, error: 'URL field is required' },
            { status: 400 }
        );
    }

    if (typeof url !== 'string' || url.trim() === '') {
        return NextResponse.json(
            { success: false, error: 'URL must be a non-empty string' },
            { status: 400 }
        );
    }

    try {
        const downloadUrl = await getDownloadUrl(url);

        return NextResponse.json({ success: true, downloadUrl });
    } catch (error) {
        logger.error(`[API] ${error.message}`, { 
            url: url?.substring(0, 100) + (url?.length > 100 ? '...' : ''),
            errorType: error.name,
            errorCode: error.code
        });

        // Determine appropriate status code based on error type
        let statusCode = 500;
        if (error instanceof VideoProcessingError) {
            switch (error.code) {
                case 'MISSING_URL':
                case 'INVALID_URL_FORMAT':
                case 'UNSUPPORTED_PROTOCOL':
                case 'DANGEROUS_PROTOCOL':
                case 'LOCALHOST_NOT_ALLOWED':
                case 'INTERNAL_IP_NOT_ALLOWED':
                case 'INVALID_IP':
                case 'URL_TOO_LONG':
                    statusCode = 400;
                    break;
                case 'UNSUPPORTED_URL':
                case 'INVALID_URL':
                    statusCode = 400;
                    break;
                case 'VIDEO_UNAVAILABLE':
                case 'PRIVATE_VIDEO':
                case 'GEO_RESTRICTED':
                    statusCode = 404;
                    break;
                case 'AUTH_REQUIRED':
                case 'RATE_LIMITED':
                    statusCode = 429;
                    break;
                default:
                    statusCode = 500;
            }
        }

        return NextResponse.json(
            { 
                success: false, 
                error: error.message || 'An unexpected error occurred',
                errorCode: error.code || 'UNKNOWN_ERROR'
            },
            { status: statusCode }
        );
    }
}
