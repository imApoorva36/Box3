'use client';

import { useAccount, useWalletClient, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Lock, Unlock, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { wrapFetchWithPayment } from 'x402-fetch';

// Mock Database Types
type UserRole = 'buyer' | 'seller' | null;
type BoxStatus = 'created' | 'shipped' | 'delivered' | 'opened';

export default function Dashboard() {
  const { address, isConnected, connector, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  
  // Local state to simulate "Server DB"
  const [role, setRole] = useState<UserRole>('buyer');
  const [boxStatus, setBoxStatus] = useState<BoxStatus>('created');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected) {
        router.push('/login');
    }
  }, [isConnected, router]);

  const toggleRole = () => {
    setRole(role === 'buyer' ? 'seller' : 'buyer');
  };

  const resetFlow = () => {
    setBoxStatus('created');
    setPaymentError(null);
    setRole('buyer');
  };

  // Real x402 Payment
  const handlePayToOpen = async () => {
    if (!walletClient || !address || !connector || !chainId) {
      setPaymentError("Wallet not connected properly");
      return;
    }

    setIsPaymentProcessing(true);
    setPaymentError(null);
    setTransactionHash(null);

    try {
      const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient);
      
      const response = await fetchWithPayment("/api/unlock-box");
      
      const paymentTxHash = response.headers.get('x-payment-transaction');
      if (paymentTxHash) {
        setTransactionHash(paymentTxHash);
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        
        // Parse x402 error for better messaging
        if (response.status === 402) {
          try {
            const x402Error = JSON.parse(errorText);
            if (x402Error.error === 'insufficient_funds') {
              throw new Error('Insufficient USDC balance. You need test USDC tokens on Base Sepolia.');
            }
          } catch (parseError) {
            // If parsing fails, show generic message
          }
        }
        
        throw new Error(`Payment failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      setBoxStatus('opened');
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  if (!isConnected) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Connect Your Wallet</CardTitle>
                  <CardDescription>Please connect your Coinbase Wallet to continue</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Wallet>
                    <ConnectWallet>
                      <Avatar className="h-6 w-6" />
                      <Name />
                    </ConnectWallet>
                  </Wallet>
                </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="font-bold text-xl flex items-center gap-2">
            <Package className="h-6 w-6" />
            Box3 Dashboard
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleRole}
            className="text-xs"
          >
            Switch to {role === 'buyer' ? 'Seller' : 'Buyer'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFlow}
            className="text-xs"
          >
            Reset
          </Button>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize font-medium">
            {role}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isConnected && (
                <>
                  <DropdownMenuItem className="font-mono text-xs">
                    {address}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => disconnect()}>
                    Disconnect
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Shipment</CardTitle>
            <CardDescription>Tracking ID: #BOX-8823</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Status Tracker */}
            <div className="relative flex justify-between mb-12 mt-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                {['created', 'shipped', 'delivered', 'opened'].map((step, idx) => {
                    const stepIdx = ['created', 'shipped', 'delivered', 'opened'].indexOf(step);
                    const currentIdx = ['created', 'shipped', 'delivered', 'opened'].indexOf(boxStatus);
                    const isCompleted = currentIdx >= stepIdx;
                    
                    return (
                        <div key={step} className="flex flex-col items-center bg-gray-50 px-2 z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300
                            ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                                {isCompleted ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                            </div>
                            <span className="text-xs mt-2 capitalize font-medium">{step}</span>
                        </div>
                    );
                })}
            </div>

            {/* Action Area */}
            <div className="border-t pt-6 flex flex-col items-center gap-4">
                {/* Seller Actions */}
                {role === 'seller' && boxStatus === 'created' && (
                <Button 
                    onClick={() => setBoxStatus('shipped')}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Truck className="mr-2 h-4 w-4" /> Ship Box
                </Button>
                )}

                {role === 'seller' && boxStatus === 'shipped' && (
                <Button 
                    onClick={() => setBoxStatus('delivered')}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark Delivered
                </Button>
                )}

                {role === 'seller' && boxStatus === 'delivered' && (
                  <p className="text-muted-foreground">
                    Box delivered! Waiting for buyer to unlock...
                  </p>
                )}

                {role === 'seller' && boxStatus === 'opened' && (
                  <p className="text-green-600 font-medium">
                    ✓ Box was successfully opened by buyer
                  </p>
                )}

                {/* Buyer Actions */}
                {role === 'buyer' && boxStatus === 'created' && (
                    <p className="text-muted-foreground">Waiting for seller to ship...</p>
                )}
                
                {role === 'buyer' && boxStatus === 'shipped' && (
                    <p className="text-muted-foreground">Package is on the way...</p>
                )}

                {role === 'buyer' && boxStatus === 'delivered' && (
                <div className="text-center space-y-4 w-full">
                    <p className="text-lg font-medium">Your box has arrived! Pay to unlock.</p>
                    <p className="text-sm text-muted-foreground">Price: $0.01 USDC (Base Sepolia)</p>
                    {paymentError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm space-y-2">
                        <p>{paymentError}</p>
                        {paymentError.includes('Insufficient USDC') && (
                          <p className="text-xs">
                            Get test USDC:{' '}
                            <a 
                              href="https://faucet.circle.com/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="underline hover:text-red-800"
                            >
                              Circle Faucet
                            </a>
                            {' '}or{' '}
                            <a 
                              href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="underline hover:text-red-800"
                            >
                              Coinbase Faucet
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                    <Button 
                      onClick={handlePayToOpen}
                      disabled={isPaymentProcessing}
                      className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 h-auto disabled:opacity-50"
                    >
                      {isPaymentProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-5 w-5" /> Pay $0.01 USDC to Open Box
                        </>
                      )}
                    </Button>
                </div>
                )}

                {role === 'buyer' && boxStatus === 'opened' && (
                <div className="text-center space-y-3">
                  <div className="text-green-600 font-bold text-xl flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-500">
                    <Unlock className="h-6 w-6" /> Box Opened Successfully!
                  </div>
                  {transactionHash && (
                    <div className="text-sm text-muted-foreground">
                      Payment confirmed!{' '}
                      <a
                        href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View transaction
                      </a>
                    </div>
                  )}
                </div>
                )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
