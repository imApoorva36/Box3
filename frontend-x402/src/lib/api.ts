// API utility functions for communicating with Next.js backend routes

interface VerifyPackageRequest {
  product_description: string;
  image_url: string;
}

interface VerifyPackageResponse {
  isValidPackage: boolean;
  reason: string;
}

interface TagResponse {
  tag_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServoResponse {
  message: string;
}

// Verify package using AI
export async function verifyPackage(data: VerifyPackageRequest): Promise<VerifyPackageResponse> {
  const response = await fetch('/api/verify-package', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Create a new RFID tag
export async function createTag(data: Record<string, any> = {}): Promise<TagResponse> {
  const response = await fetch('/api/create-tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Get tag information from RFID reader
export async function getTag(): Promise<TagResponse> {
  const response = await fetch('/api/get-tag', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Actuate servo motor to open/close box
export async function actuateServo(): Promise<ServoResponse> {
  const response = await fetch('/api/servo', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
