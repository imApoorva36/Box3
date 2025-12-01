# **Box3** - The Future of Decentralized Logistics

**Box3** is a cutting-edge secure delivery ecosystem that solves the "last-mile trust" problem by combining **IoT (RFID)**, **Blockchain (Base)**, and **Cryptographic Payments (x402)**.

We ensure that a package is not just "delivered" but **verified and unlocked** only when payment is secured on-chain.

![Box3 Logo](flutter_app/assets/box3-logo.png)

---

## **🚀 The Problem**

In traditional logistics, "Cash on Delivery" is risky, and digital payments often lack synchronization with the physical handover. Porch piracy and disputed deliveries cost billions annually.

## **💡 The Solution: "Pay to Open"**

Box3 introduces a hardware-software bridge:

1.  **Smart Packaging**: Boxes are sealed with IoT/RFID locks.
2.  **On-Chain Tracking**: Every scan (Created, Shipped, Delivered) is recorded on the blockchain.
3.  **x402 Payment Gate**: The buyer pays a micro-transaction (USDC) via the app.
4.  **Instant Unlock**: The x402 protocol verifies payment and triggers the IoT lock to open.

---

## **🏗️ System Architecture**

![Architecture Diagram](https://github.com/user-attachments/assets/07511f60-c2f1-480a-81ac-85d037859c5b)

### **Core Components**

1.  **Frontend & Payments (Next.js + x402)**

    - **"Pay to Open"**: Uses the HTTP 402 standard to gate physical access behind crypto payments.
    - **Wallets**: Integrated with **Coinbase Wallet** (OnchainKit) and **MetaMask**.
    - **Network**: Deployed on **Base Sepolia** for fast, cheap USDC transactions.

2.  **IoT & Hardware (Raspberry Pi + RFID)**

    - **RFID Authentication**: Taps RFID cards to capture package identity.
    - **Smart Lock**: Controlled by the Raspberry Pi, unlocking only upon blockchain verification.

3.  **Decentralized Logic (Base)**

    - **Base**: Handles both the smart contract logic for package state and the financial settlement layer (USDC payments).

4.  **Mobile Experience (Flutter)**
    - A secure mobile interface for couriers and users to interact with the system on the go.

---

## **✨ Key Features**

- **🔐 x402 Payment Gate**: Native HTTP 402 integration for seamless "Pay-to-Unlock" flows.
- **📦 Smart Logistics**: Real-time tracking from "Created" to "Opened" using RFID scans.
- **💰 Dynamic Pricing**: Boxes have dynamic values ($0.01 - $0.08) handled via smart middleware.

---

## **🛠️ Tech Stack**

| Component        | Technology                             |
| :--------------- | :------------------------------------- |
| **Web App**      | Next.js 16, Tailwind CSS, Shadcn UI    |
| **Payments**     | **x402 Protocol**, USDC (Base Sepolia) |
| **Wallets**      | **Coinbase Wallet** (OnchainKit), Okto |
| **IoT Hardware** | Raspberry Pi, RFID RC522               |
| **Backend**      | Django (Python), Node.js Middleware    |
| **Blockchain**   | **Base** (Payments & Data)             |
| **Mobile App**   | Flutter                                |

---

## **🏁 Getting Started**

### **Option A: Run the Web Demo (x402 Payments)**

Experience the "Pay to Open" flow immediately without hardware.

1.  **Navigate to the frontend:**
    ```bash
    cd frontend-x402
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Create `.env.local` with your OnchainKit API Key and Wallet Address.
4.  **Run the App:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

### **Option B: Full Hardware Setup**

1.  **Backend (Django)**:
    ```bash
    cd backend
    pip install -r requirements.txt
    python manage.py runserver
    ```
2.  **Hardware**: Connect your RFID receiver to the Raspberry Pi and run the python bridge script.
3.  **Mobile**:
    ```bash
    cd flutter_app
    flutter run
    ```

---

_Built for the Future of Logistics._
