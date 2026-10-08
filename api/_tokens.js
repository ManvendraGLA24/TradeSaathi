// Baked SmartAPI symbol -> token map (NSE equity), resolved once via searchScrip.
// Avoids per-request symbol lookups (faster + stays under rate limits).
// Extend this list to widen the scanner universe.
export const NSE_TOKENS = {
  RELIANCE: "2885", TCS: "11536", INFY: "1594", HDFCBANK: "1333", ICICIBANK: "4963",
  SBIN: "3045", AXISBANK: "5900", KOTAKBANK: "1922", BHARTIARTL: "10604", ITC: "1660",
  LT: "11483", HINDUNILVR: "1394", MARUTI: "10999", TATASTEEL: "3499", ONGC: "2475",
  ASIANPAINT: "236", WIPRO: "3787", HCLTECH: "7229", BAJFINANCE: "317", BAJAJFINSV: "16675",
  SUNPHARMA: "3351", NTPC: "11630", POWERGRID: "14977", COALINDIA: "20374", ADANIPORTS: "15083",
  ADANIENT: "25", JSWSTEEL: "11723", HINDALCO: "1363", BHEL: "438", HINDCOPPER: "17939",
  MANAPPURAM: "19061", UPL: "11287", DRREDDY: "881", CIPLA: "694", DIVISLAB: "10940",
  EICHERMOT: "910", BRITANNIA: "547", APOLLOHOSP: "157", GRASIM: "1232",
};
export const UNIVERSE = Object.keys(NSE_TOKENS);
