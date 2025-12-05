import { NextRequest, NextResponse } from 'next/server';

async function forwardRequest(request: NextRequest, method: string, slug: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
  }
  const path = slug.join('/');
  const url = new URL(`${baseUrl}/${path}`);
  url.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('referer');

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  // Add body and duplex option for methods that can have a body
  if (method !== 'GET' && method !== 'HEAD') {
    fetchOptions.body = request.body;
    (fetchOptions as any).duplex = 'half';
  }

  const response = await fetch(url.toString(), fetchOptions);

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return forwardRequest(request, 'GET', slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return forwardRequest(request, 'POST', slug);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return forwardRequest(request, 'PUT', slug);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return forwardRequest(request, 'DELETE', slug);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  return forwardRequest(request, 'PATCH', slug);
}
