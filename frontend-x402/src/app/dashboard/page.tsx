'use client';

import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  ConnectWallet, 
  WalletDropdown, 
  WalletDropdownDisconnect 
} from '@coinbase/onchainkit/wallet';
import { 
  Identity, 
  Avatar, 
  Name, 
  Address, 
  EthBalance 
} from '@coinbase/onchainkit/identity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Lock, Unlock } from 'lucide-react';

// Mock Database Types
type UserRole = 'buyer' | 'seller' | null;
type BoxStatus = 'created' | 'shipped' | 'delivered' | 'opened';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  
  // Local state to simulate "Server DB"
  const [role, setRole] = useState<UserRole>(null);
  const [boxStatus, setBoxStatus] = useState<BoxStatus>('created');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!isConnected) {
        // router.push('/login'); // Commented out for dev ease, but should be there
    }
  }, [isConnected, router]);

  // Mock Registration
  const handleRegister = (selectedRole: 'buyer' | 'seller') => {
    setRole(selectedRole);
    setIsRegistered(true);
    // In real app: POST /api/register { address, role }
  };

  // Mock x402 Payment
  const handlePayToOpen = async () => {
    // 1. Call x402 API to verify payment or charge user
    // 2. On success:
    alert("Payment Verified via x402! Opening Box...");
    setBoxStatus('opened');
  };

  if (!isConnected) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p>Please connect your wallet.</p>
          </div>
      )
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Complete Registration</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleRegister('buyer')}>
            <CardHeader>
                <CardTitle>I am a Buyer</CardTitle>
                <CardDescription>I want to receive boxes.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Package className="h-16 w-16 text-blue-500" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleRegister('seller')}>
            <CardHeader>
                <CardTitle>I am a Seller</CardTitle>
                <CardDescription>I want to ship boxes.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Truck className="h-16 w-16 text-green-500" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="font-bold text-xl flex items-center gap-2">
            <Package className="h-6 w-6" />
            Box3 Dashboard
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize font-medium">
            {role}
          </span>
           <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
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
            <div className="border-t pt-6 flex justify-center">
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

                {role === 'buyer' && boxStatus === 'delivered' && (
                <div className="text-center space-y-4">
                    <p className="text-lg font-medium">Your box has arrived! Pay to unlock.</p>
                    <Button 
                    onClick={handlePayToOpen}
                    className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 h-auto"
                    >
                    <Lock className="mr-2 h-5 w-5" /> Pay x402 to Open Box
                    </Button>
                </div>
                )}

                {boxStatus === 'opened' && (
                <div className="text-center text-green-600 font-bold text-xl flex items-center animate-in fade-in zoom-in duration-500">
                    <Unlock className="mr-2 h-6 w-6" /> Box Opened Successfully!
                </div>
                )}
                
                {role === 'buyer' && boxStatus === 'created' && (
                    <p className="text-muted-foreground">Waiting for seller to ship...</p>
                )}
                 {role === 'buyer' && boxStatus === 'shipped' && (
                    <p className="text-muted-foreground">Package is on the way...</p>
                )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
