'use client';

import { useAccount, useWalletClient, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Lock, Unlock, Loader2, AlertCircle, Plus, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { wrapFetchWithPayment } from 'x402-fetch';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

// Mock Database Types
type UserRole = 'buyer' | 'seller' | null;
type BoxStatus = 'created' | 'shipped' | 'delivered' | 'opened';

interface Box {
  id: number;
  trackingId: string;
  metadata: string;
  status: BoxStatus;
  value: string;
  customer: string;
}

const mockBoxes: Box[] = [
  { id: 1, trackingId: 'BOX-8823', metadata: 'Electronics - Smart Watch', status: 'delivered', value: '$0.05', customer: '0x1234...5678' },
  { id: 2, trackingId: 'BOX-4521', metadata: 'Books - Fiction Collection', status: 'shipped', value: '$0.02', customer: '0x2345...6789' },
  { id: 3, trackingId: 'BOX-9102', metadata: 'Clothing - Winter Jacket', status: 'created', value: '$0.08', customer: '0x3456...7890' },
  { id: 4, trackingId: 'BOX-7634', metadata: 'Kitchen - Coffee Maker', status: 'delivered', value: '$0.03', customer: '0x4567...8901' },
  { id: 5, trackingId: 'BOX-2198', metadata: 'Sports - Running Shoes', status: 'opened', value: '$0.01', customer: '0x5678...9012' },
];

export default function Dashboard() {
  const { address, isConnected, connector, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  
  // Local state to simulate "Server DB"
  const [role, setRole] = useState<UserRole>('buyer');
  const [boxes, setBoxes] = useState<Box[]>(mockBoxes);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState<number | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, opened: 0 });

  useEffect(() => {
    if (!isConnected) {
        router.push('/login');
    }
  }, [isConnected, router]);

  useEffect(() => {
    calculateStats();
  }, [boxes]);

  const calculateStats = () => {
    const total = boxes.length;
    const delivered = boxes.filter(box => box.status === 'delivered').length;
    const opened = boxes.filter(box => box.status === 'opened').length;
    const pending = total - delivered - opened;
    setStats({ total, delivered, pending, opened });
  };

  const toggleRole = () => {
    setRole(role === 'buyer' ? 'seller' : 'buyer');
  };

  const handleShipBox = (boxId: number) => {
    setBoxes(boxes.map(box => 
      box.id === boxId ? { ...box, status: 'shipped' as BoxStatus } : box
    ));
  };

  const handleMarkDelivered = (boxId: number) => {
    setBoxes(boxes.map(box => 
      box.id === boxId ? { ...box, status: 'delivered' as BoxStatus } : box
    ));
  };

  // Real x402 Payment
  const handlePayToOpen = async (boxId: number) => {
    if (!walletClient || !address || !connector || !chainId) {
      setPaymentError("Wallet not connected properly");
      return;
    }

    setIsPaymentProcessing(boxId);
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
      setBoxes(boxes.map(box => 
        box.id === boxId ? { ...box, status: 'opened' as BoxStatus } : box
      ));
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally {
      setIsPaymentProcessing(null);
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
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center border-b-2 border-red-500">
        <div className="font-bold text-xl flex items-center gap-2">
            <Package className="h-6 w-6 text-red-600" />
            <span className="text-gray-800">Box3 Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleRole}
            className="text-xs hover:bg-red-50 hover:border-red-500"
          >
            Switch to {role === 'buyer' ? 'Seller' : 'Buyer'}
          </Button>
          <Badge variant="outline" className="px-3 py-1 bg-red-100 text-red-800 border-red-300 capitalize font-medium">
            {role}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-500">
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

      <main className="max-w-7xl mx-auto p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Boxes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <Package className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.delivered}</div>
                <Truck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.pending}</div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Opened</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{stats.opened}</div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boxes Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {role === 'buyer' ? 'My Boxes' : 'All Shipments'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boxes.map((box) => (
              <Card key={box.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">Box #{box.id}</span>
                    <Badge 
                      variant={box.status === 'opened' ? 'default' : box.status === 'delivered' ? 'secondary' : 'outline'}
                      className={
                        box.status === 'opened' ? 'bg-green-100 text-green-800 border-green-300' :
                        box.status === 'delivered' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        box.status === 'shipped' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        'bg-gray-100 text-gray-800 border-gray-300'
                      }
                    >
                      {box.status === 'opened' && <CheckCircle className="h-4 w-4 mr-1" />}
                      {box.status === 'delivered' && <Truck className="h-4 w-4 mr-1" />}
                      {box.status === 'shipped' && <Package className="h-4 w-4 mr-1" />}
                      {box.status === 'created' && <Package className="h-4 w-4 mr-1" />}
                      <span className="capitalize">{box.status}</span>
                    </Badge>
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {box.trackingId}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm"><strong>Contents:</strong> {box.metadata}</p>
                  <p className="text-sm"><strong>Value:</strong> {box.value}</p>
                  {role === 'seller' && (
                    <p className="text-sm"><strong>Customer:</strong> {box.customer}</p>
                  )}
                </CardContent>
                <CardFooter>
                  {role === 'seller' && box.status === 'created' && (
                    <Button 
                      onClick={() => handleShipBox(box.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Truck className="mr-2 h-4 w-4" /> Mark as Shipped
                    </Button>
                  )}
                  {role === 'seller' && box.status === 'shipped' && (
                    <Button 
                      onClick={() => handleMarkDelivered(box.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
                    </Button>
                  )}
                  {role === 'buyer' && box.status === 'delivered' && (
                    <div className="w-full space-y-3">
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
                        onClick={() => handlePayToOpen(box.id)}
                        disabled={isPaymentProcessing === box.id}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50"
                      >
                        {isPaymentProcessing === box.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" /> Pay $0.01 USDC to Open
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  {role === 'buyer' && box.status === 'opened' && (
                    <div className="w-full text-center space-y-2">
                      <div className="text-green-600 font-bold flex items-center justify-center gap-2">
                        <Unlock className="h-5 w-5" /> Box Opened Successfully!
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
                  {role === 'buyer' && (box.status === 'created' || box.status === 'shipped') && (
                    <p className="text-sm text-muted-foreground w-full text-center">
                      {box.status === 'created' ? 'Waiting for seller to ship...' : 'Package is on the way...'}
                    </p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
