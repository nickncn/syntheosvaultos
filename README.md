# Syntheos VaultOS

**BTC Sovereign Modular Yield Vault on StarkNet**
> Modular. Permissionless. AI-Powered. ZK-Ready. Built with Pragma Oracle.

---

## 🚀 What is VaultOS?

VaultOS is the **first fully modular, permissionless BTC yield vault on StarkNet**.  
- **Modular Strategies:** Anyone can deploy a new strategy contract and register it instantly.
- **AI Routing:** Our on-chain AI agent auto-routes yield for optimal returns.
- **ZK Proofs:** Privacy-enabled. Prove yield or balances without leaking data.
- **Dynamic Risk Management:** Live CDR (collateral ratio) with Pragma oracles, volatility-aware, and safe by design.
- **Developer Ready:** Plug-in architecture, open API, extensible front-end, and strategy marketplace.

---

## 🧠 Key Features

- **Plug-and-Play Strategies:** Any dev can build and add strategies (see `IStrategy` interface below)
- **AI-Driven Routing:** Real-time APY and risk feeds switch capital for best yield
- **On-chain Oracle Integration:** Live price feed, CDR, and auto-liquidation logic via Pragma
- **ZK Proof Verification:** Users can prove positions (mocked demo for hackathon)
- **XP & Loyalty System:** Gamified tiers for users, more yield for active stakers

---

## 🛠️ Architecture

![VaultOS Architecture Diagram](./architecture.png) <!-- Create a simple boxes/arrows diagram if you can -->

- **Vault Core:** Holds user funds, tracks balances, handles deposits/withdrawals
- **Strategy Plugins:** Pluggable contracts implementing `IStrategy` (Ekubo, Vesu, or custom)
- **AI Router:** Decides best strategy using oracle data, risk, and APY
- **Oracle Module:** Pulls live BTC/USD & risk metrics from Pragma
- **ZK Proof Module:** (Mocked for demo) accepts proof of balances/positions
- **Front-End Dapp:** Modular React UI, real-time updates, plug-in marketplace

---

## 🖥️ Try the Demo

1. Clone this repo & install deps:
   ```bash
   git clone https://github.com/nickncn/starknetvaultOS.git
   cd vaultos
   npm install
   npm run dev
