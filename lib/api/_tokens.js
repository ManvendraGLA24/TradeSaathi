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

// NSE index tokens (for the Home ticker / Index Mover).
export const INDEX_TOKENS = {
  'NIFTY 50': '99926000', 'NIFTY BANK': '99926009', 'NIFTY FIN SERVICE': '99926037',
  'NIFTY IT': '99926008', 'INDIA VIX': '99926017',
};

// NIFTY 50 constituents: [symbol, token, weight %]. Symbols = official niftyindices.com
// list; weights = published "Nifty 50 Index Constituents as on 19.08.2026" (Taurus MF).
// BSE joined after that date -> it takes the residual weight (100 - sum of the rest).
export const NIFTY50 = [
  ['ADANIENT', '25', 0.78],
  ['ADANIPORTS', '15083', 1.13],
  ['APOLLOHOSP', '157', 0.82],
  ['ASIANPAINT', '236', 1.08],
  ['AXISBANK', '5900', 3.22],
  ['BSE', '19585', 0.42],
  ['BAJAJ-AUTO', '16669', 1.17],
  ['BAJFINANCE', '317', 2.63],
  ['BAJAJFINSV', '16675', 1.06],
  ['BEL', '383', 1.33],
  ['BHARTIARTL', '10604', 5.3],
  ['CIPLA', '694', 0.73],
  ['COALINDIA', '20374', 0.87],
  ['DRREDDY', '881', 0.65],
  ['EICHERMOT', '910', 1],
  ['ETERNAL', '5097', 2.1],
  ['GRASIM', '1232', 1.12],
  ['HCLTECH', '7229', 1.27],
  ['HDFCBANK', '1333', 10.01],
  ['HDFCLIFE', '467', 0.52],
  ['HINDALCO', '1363', 1.37],
  ['HINDUNILVR', '1394', 1.63],
  ['ICICIBANK', '4963', 9.11],
  ['ITC', '1660', 2.34],
  ['INFY', '1594', 3.56],
  ['INDIGO', '11195', 1.07],
  ['JSWSTEEL', '11723', 1.09],
  ['JIOFIN', '18143', 0.72],
  ['KOTAKBANK', '1922', 2.61],
  ['LT', '11483', 4.29],
  ['M&M', '2031', 2.77],
  ['MARUTI', '10999', 1.62],
  ['MAXHEALTH', '22377', 0.67],
  ['NTPC', '11630', 1.45],
  ['NESTLEIND', '17963', 0.95],
  ['ONGC', '2475', 0.84],
  ['POWERGRID', '14977', 1.08],
  ['RELIANCE', '2885', 8.04],
  ['SBILIFE', '21808', 0.73],
  ['SHRIRAMFIN', '4306', 1.41],
  ['SBIN', '3045', 3.93],
  ['SUNPHARMA', '3351', 1.83],
  ['TCS', '11536', 2.12],
  ['TATACONSUM', '3432', 0.63],
  ['TMPV', '3456', 0.61],
  ['TATASTEEL', '3499', 1.38],
  ['TECHM', '13538', 0.92],
  ['TITAN', '3506', 1.9],
  ['TRENT', '1964', 0.89],
  ['ULTRACEMCO', '11532', 1.23],
];

