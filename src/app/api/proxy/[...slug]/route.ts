import { NextRequest, NextResponse } from 'next/server';

async function forwardRequest(request: NextRequest, method: string, slug: string[]) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
  }
  const path = slug.join('/');
  const url = `${baseUrl}/${path}`;
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

  const response = await fetch(url, fetchOptions);

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return forwardRequest(request, 'GET', params.slug);
}

export async function POST(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return forwardRequest(request, 'POST', params.slug);
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return forwardRequest(request, 'PUT', params.slug);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return forwardRequest(request, 'DELETE', params.slug);
}

export async function PATCH(request: NextRequest, { params }: { params: { slug: string[] } }) {
  return forwardRequest(request, 'PATCH', params.slug);
}
