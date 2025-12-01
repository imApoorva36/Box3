'use client';

import { useAccount, useConnect } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Box3</CardTitle>
          <CardDescription>Connect your wallet to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pb-8">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => connect({ connector })}
              variant="outline"
              className="w-full"
            >
              Connect with {connector.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
