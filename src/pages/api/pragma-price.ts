// src/pages/api/pragma-price.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch("https://api.pragma.build/feed/btc-usd", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "x-api-key": process.env.NEXT_PUBLIC_PRAGMA_API_KEY || ""
            } as HeadersInit
        });

        const data = await response.json();
        const price = Number(data?.price || 0);
        res.status(200).json({ price });
    } catch (err) {
        console.error("Error fetching price:", err);
        res.status(500).json({ error: "Failed to fetch price" });
    }
}
