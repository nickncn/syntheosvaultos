// src/lib/cdr.ts

// Example: For 150% CDR, you must always have 1.5x the value of BTC deposited as collateral.

export function calculateCDR(vaultBTC: number, btcUsdPrice: number, vaultDebt: number) {
    // vaultBTC: in sats or mBTC, up to you (should match price unit!)
    // vaultDebt: in USD (or whatever stable asset)
    if (vaultDebt === 0) return 999; // infinite CDR
    return ((vaultBTC * btcUsdPrice) / vaultDebt) * 100;
}

// Volatility as rolling stddev or % delta
export function calculateVolatility(prices: number[], window = 5) {
    if (prices.length < window) return 0;
    const recent = prices.slice(-window);
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / window;
    return Math.sqrt(variance);
}
