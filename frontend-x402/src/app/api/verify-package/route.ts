import { NextRequest, NextResponse } from 'next/server';

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || 'http://192.168.167.131:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_description, image_url } = body;

    // Validate required fields
    if (!product_description || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields: product_description and image_url' },
        { status: 400 }
      );
    }

    // Forward request to Django backend
    const response = await fetch(`${DJANGO_BASE_URL}/api/verify_package/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_description,
        image_url,
      }),
    });

    if (!response.ok) {
      throw new Error(`Django backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error calling Django backend:', error);
    return NextResponse.json(
      { error: 'Failed to verify package' },
      { status: 500 }
    );
  }
}
