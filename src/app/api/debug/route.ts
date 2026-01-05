import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  return NextResponse.json({
    hasUrl: !!url,
    urlLength: url?.length,
    urlPrefix: url?.substring(0, 20),
    urlSuffix: url?.substring(url.length - 10),
    hasAuthToken: !!authToken,
    authTokenLength: authToken?.length,
  });
}

