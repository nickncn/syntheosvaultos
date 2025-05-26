const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const vault = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
const mockbtc = process.env.NEXT_PUBLIC_MOCKBTC_ADDRESS;

if (!vault || !mockbtc) {
    throw new Error("Missing env vars: check NEXT_PUBLIC_VAULT_ADDRESS and NEXT_PUBLIC_MOCKBTC_ADDRESS");
}

const yaml = `project: "btc_vault"

contracts:
  - name: MockBTC
    address: ${mockbtc}
    description: ERC20-style BTC token used for testing
    tags: [erc20, mock, testnet]

  - name: Vault
    address: ${vault}
    description: u256 BTC vault with deposit and withdraw
    tags: [vault, deposit, u256]

feeds:
  - id: "btc_usd"
    type: "price"
    asset: "btc"
    currency: "usd"
`;

fs.writeFileSync("pragma.yaml", yaml);
console.log("✅ pragma.yaml generated from .env.local");
