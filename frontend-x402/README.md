# Box3 - Secure Delivery with x402 Payments

A decentralized delivery platform that uses HTTP 402 payments to unlock packages upon delivery.

## Features

- **Wallet Authentication**: Connect with Coinbase Wallet
- **x402 Payments**: Pay-to-unlock mechanism using USDC on Base Sepolia
- **Delivery Tracking**: Real-time shipment status updates
- **Dual Role Support**: Seller and buyer interfaces

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
RESOURCE_WALLET_ADDRESS=0xYourAddress
NETWORK=base-sepolia
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** - React framework
- **OnchainKit** - Coinbase wallet integration
- **x402** - HTTP 402 payment protocol
- **Wagmi** - Ethereum interactions
- **Tailwind CSS** - Styling

## How It Works

1. Seller creates and ships a box
2. Seller marks box as delivered
3. Buyer pays $0.01 in USDC to unlock
4. Payment is verified on-chain
5. Box is unlocked

## License

MIT
