import { useEffect, useState } from "react";
import { usePragmaBTCPrice } from "./usePragmaBTCPrice";

export function useDynamicCDR() {
    const { price } = usePragmaBTCPrice();
    const [cdr, setCdr] = useState<number | null>(null);
    const [cdrReason, setCdrReason] = useState<string>("");

    useEffect(() => {
        if (price === null) return;
        const vaultBal = parseInt(localStorage.getItem("mock_balance") || "0", 10);
        if (vaultBal === 0) {
            setCdr(null);
            setCdrReason("No balance");
            return;
        }
        // Formula: Collateral Value / Debt (example, you can tune this!)
        const debt = 100;
        const collateralValue = vaultBal * price;
        const currentCDR = (collateralValue / debt);
        setCdr(currentCDR);
        setCdrReason(currentCDR < 150 ? "⚠️ Risk: CDR below minimum!" : "");
    }, [price]);

    return { cdr, cdrReason };
}
