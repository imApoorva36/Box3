import { NextRequest, NextResponse } from 'next/server';

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || 'http://192.168.167.131:8000';

export async function GET(request: NextRequest) {
  try {
    // Forward request to Django backend
    const response = await fetch(`${DJANGO_BASE_URL}/api/get_tag/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Django backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error calling Django backend:', error);
    return NextResponse.json(
      { error: 'Failed to get tag' },
      { status: 500 }
    );
  }
}
