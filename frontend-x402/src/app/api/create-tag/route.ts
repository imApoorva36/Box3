import { NextRequest, NextResponse } from 'next/server';

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || 'http://192.168.167.131:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to Django backend
    const response = await fetch(`${DJANGO_BASE_URL}/api/create_tag/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Django backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error calling Django backend:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
