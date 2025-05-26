// src/pages/index.tsx
import Head from "next/head";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import VaultInterface from "../components/VaultInterface";
import XPTracker from "../components/XPTracker";
import { XPLeaderboard } from "../components/XPLeaderboard";
import Rebalancer from "../components/Rebalancer";
import WalletConnect from "../components/WalletConnect";
import UserCard from "../components/UserCard";
import AnalyticsChart from "../components/AnalyticsChart";
import CDRHistoryChart from "../components/CDRHistoryChart";
import StrategyToggle from "../components/StrategyToggle";
import AIDashboardPanel from "../components/AIDashboardPanel";
import StrategyMarketplace from "../components/StrategyMarketplace";
import ZKProofPanel from "../components/ZKProofPanel";
import TabButton from "../components/TabButton";
import WalletStatus from "../components/WalletStatus";
import PragmaAdminPanel from "../components/PragmaAdminPanel";
import LiveBTCPriceWidget from "../components/LiveBTCPriceWidget";

const tabs = ["Vault", "Performance", "AI Dashboard", "Marketplace", "ZK Proofs"];



export default function Home() {
  const [activeTab, setActiveTab] = useState("Vault");
  const [xp, setXp] = useState(0);

  return (
    <>
      <Head>
        <title>Syntheos VaultOS</title>
      </Head>
      <div className="fixed inset-0 -z-10 bg-syntheos" />

      <main className="relative z-10 min-h-screen px-4 py-10 text-white flex flex-col items-center gap-6">
        <div className="fixed top-4 right-4 flex flex-col items-end z-50 gap-3">
          <WalletConnect />
          <LiveBTCPriceWidget />

        </div>

        <div className="fixed top-4 left-4 z-50 flex flex-col items-start">
          <h1 className="text-3xl mt-2 md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Syntheos VaultOS
          </h1>
          <p className="text-gray-300 mt-3 text-xs md:text-base">BTC Sovereign Vault on StarkNet</p>
        </div>


        <nav className="flex gap-4 mt-8">
          {tabs.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {activeTab === "Vault" && (
            <motion.div
              key="vault"
              className="w-full max-w-6xl grid grid-cols-1 mt-12 md:grid-cols-2 gap-12"

              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-6">
                <UserCard xp={xp} />
                <WalletStatus />
                <VaultInterface />
              </div>
              <Rebalancer />
            </motion.div>
          )}

          {activeTab === "Performance" && (
            <motion.div
              key="performance"
              className="w-full max-w-5xl grid grid-cols-1 mt-12 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <XPTracker xp={xp} setXp={setXp} />
              <XPLeaderboard currentXP={xp} />
              <AnalyticsChart />
              <CDRHistoryChart />
            </motion.div>
          )}

          {activeTab === "AI Dashboard" && (
            <motion.div
              key="ai"
              className="w-full max-w-5xl mt-12 mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AIDashboardPanel />
            </motion.div>
          )}

          {activeTab === "Marketplace" && (
            <motion.div
              key="marketplace"
              className="w-full max-w-5xl grid grid-cols-1 mt-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StrategyMarketplace />
            </motion.div>
          )}

          {activeTab === "ZK Proofs" && (
            <motion.div
              key="zkproof"
              className="w-full max-w-3xl grid grid-cols-1 mt-12 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ZKProofPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="pt-10 text-xs text-gray-500 text-center">
          Built for StarkNet Hackathon · Powered by VaultOS
        </footer>
      </main>
    </>
  );
}
