import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: "Box unlocked successfully!",
    boxId: "BOX-8823",
    timestamp: new Date().toISOString()
  });
}
