// Trade record interface
interface TradeRecord {
    tradeSize: number;    // shares or dollar value
    stockType: string;    // e.g., "Tech", "Energy"
    holdingTime: number;  // days
    timestamp: number;    // Unix time
}

// Trade tracking class
class TradeTracker {
    private storageKey = "baselineTrades";

    saveTrade(trade: TradeRecord): void {
        chrome.storage.local.get([this.storageKey], (result) => {
            const trades: TradeRecord[] = result[this.storageKey] || [];
            trades.push(trade);
            chrome.storage.local.set({ [this.storageKey]: trades }, () => {
                console.log("✅ Trade saved:", trade);
            });
        });
    }

    getTrades(callback: (trades: TradeRecord[]) => void): void {
        chrome.storage.local.get([this.storageKey], (result) => {
            callback(result[this.storageKey] || []);
        });
    }

    clearTrades(): void {
        chrome.storage.local.remove(this.storageKey, () => {
            console.log("🗑️ All trades cleared.");
        });
    }
}

// Example usage when extension loads
const tracker = new TradeTracker();

const exampleTrade: TradeRecord = {
    tradeSize: 150,
    stockType: "Tech",
    holdingTime: 5,
    timestamp: Date.now(),
};

tracker.saveTrade(exampleTrade);

tracker.getTrades((trades) => {
    console.log("📊 All trades:", trades);
});
