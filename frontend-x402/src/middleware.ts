import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/unlock-box') {
    // Get amount from query param, default to 0.01 if missing
    const amountParam = request.nextUrl.searchParams.get('amount');
    const amount = amountParam ? amountParam : '0.01';

    // Check if the request has the payment header
    const paymentToken = request.headers.get('authorization');

    if (!paymentToken) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Payment Required',
          message: `Please pay $${amount} USDC to unlock this box.`
        }),
        { 
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            // x402 Payment Requirement Header
            'WWW-Authenticate': `x402 scheme="exact", network="base-sepolia", amount="${amount}", asset="0x036CbD53842c5426634e7929541eC2318f3dCF7e", payTo="${process.env.RESOURCE_WALLET_ADDRESS || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"}"`
          }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/unlock-box',
};
