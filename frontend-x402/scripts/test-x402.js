/*
 * Simple Node.js test script to verify x402 payment flow against the local dev server
 * Uses viem to create a wallet client (signing with a private key) and x402-fetch to automatically handle the 402 Payment Required flow.
 * NOTE: For real testing, replace the RPC URL and keys with your own; never commit secrets to source control.
 */

require('dotenv').config();

const { createWalletClient, createPublicClient, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { baseSepolia } = require('viem/chains');
const wrapFetchWithPayment = require('x402-fetch').wrapFetchWithPayment;

async function main() {
  const targetUrl = process.env.TARGET_URL || 'http://localhost:3000/api/unlock-box';
  const privateKey = process.env.TEST_PRIVATE_KEY || '0x59c6995e998f97a5a0044976f1a1aaf4a6d06bd6a73f1d1b1e483d1a76e9363e'; // test key

  // Configure a public client and wallet client for Base Sepolia
  const rpcUrl = process.env.RPC_URL || 'https://sepolia.base.org';
  const publicClient = createPublicClient({ chain: baseSepolia, transport: http(rpcUrl) });

  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({ chain: baseSepolia, transport: http(rpcUrl), account });

  console.log('Using account:', account.address);

  // Wrap the native fetch (node fetch) with x402 payment handling
  const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient);

  try {
    console.log('Calling protected endpoint:', targetUrl);
    const resp = await fetchWithPayment(targetUrl, { method: 'GET' });

    console.log('Response status:', resp.status);
    const body = await resp.text();
    console.log('Response body:', body);
  } catch (err) {
    console.error('Error during request:', err);
  }
}

main();
