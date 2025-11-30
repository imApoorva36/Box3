'use client';

import { useAccount } from 'wagmi';
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
import { verifyPayment } from '../actions';

export default function PaywallPage() {
  const { address } = useAccount();

  const handlePayment = async () => {
      // Trigger payment logic.
      // For this setup, I'll just simulate a payment action.
      console.log("Processing payment...");
      // Call server action
      await verifyPayment({ dummy: "data" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8">Payment Required</h1>
      <p className="mb-4">You need to pay to open your box.</p>
      
      <div className="flex justify-end mb-8">
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

      {address && (
          <button 
            onClick={handlePayment}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
              Pay 0.001 ETH
          </button>
      )}
    </div>
  );
}
