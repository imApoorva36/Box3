'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Box3 x402',
    }),
    metaMask(),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
