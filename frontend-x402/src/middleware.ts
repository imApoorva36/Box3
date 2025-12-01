import { paymentMiddleware } from "x402-next";
import type { NextRequest } from "next/server";
import { getAddress } from "viem";

const payTo = getAddress((process.env.RESOURCE_WALLET_ADDRESS as `0x${string}`) || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0");
const network = (process.env.NETWORK as "base-sepolia") || "base-sepolia";

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/unlock-box": {
      price: "$0.01",
      network,
      config: {
        description: "Unlock Box3 delivery box",
      },
    },
  },
  {
    url: "https://x402.org/facilitator",
  }
);

export const config = {
  matcher: ["/api/unlock-box"],
  runtime: "nodejs",
};
