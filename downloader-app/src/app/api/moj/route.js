import { getDownloadUrl } from '@/utils/downloader';
import { NextResponse } from 'next/server';
import logger from '@/utils/logger';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const downloadUrl = await getDownloadUrl(url);

    return NextResponse.json({ success: true, downloadUrl });
  } catch (error) {
    logger.error(`[API] ${error.message}`);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}
