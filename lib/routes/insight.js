import { gemini } from '../api/_gemini.js';
import { readRequestBody, requireSession } from '../api/_auth.js';
import { INDEX_TOKENS, NSE_TOKENS } from '../api/_tokens.js';
import { candles, quoteTokens } from '../api/_smartapi.js';

function relativeStrengthIndex(values) {
  if (values.length < 15) return null;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - 14; i < values.length; i += 1) {
    const change = values[i] - values[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  if (losses === 0) return gains === 0 ? 50 : 100;
  return +(100 - 100 / (1 + gains / losses)).toFixed(2);
}

export default async function handler(req, res) {
  if (!requireSession(req, res)) return;
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const body = await readRequestBody(req);
    const symbol = typeof body.symbol === 'string' ? body.symbol.trim().toUpperCase() : '';
    const indexToken = INDEX_TOKENS[symbol];
    const equityToken = NSE_TOKENS[symbol];
    if (!indexToken && !equityToken) return res.status(400).json({ error: 'Choose a supported NSE symbol or index.' });

    const exchange = indexToken ? 'NSE' : 'NSE';
    const token = indexToken || equityToken;
    const [quote] = await quoteTokens(exchange, [{ symbol, token }]);
    if (quote?.ltp == null) return res.status(502).json({ error: `No live quote is available for ${symbol}.` });

    const history = await candles(exchange, token, 'FIVE_MINUTE', 2);
    const closes = history.map((row) => Number(row[4])).filter(Number.isFinite);
    const snapshot = {
      asOf: new Date().toISOString(),
      symbol,
      quote: {
        ltp: quote.ltp,
        change: quote.change,
        percentChange: quote.pct,
        volume: quote.volume,
      },
      indicators: {
        rsi14: relativeStrengthIndex(closes),
        sma20: closes.length >= 20
          ? +(closes.slice(-20).reduce((sum, value) => sum + value, 0) / 20).toFixed(2)
          : null,
      },
    };
    const result = await gemini(
      `Explain this Indian market snapshot in plain language. It is ${JSON.stringify(snapshot)}. ` +
      'Treat the supplied Angel One values as the only source for prices and indicators. ' +
      'Google Search may be used only for recent public context; clearly separate it from the snapshot. ' +
      'Do not make a price prediction, give a buy/sell recommendation, or imply certainty. ' +
      'State when the data is insufficient and keep the explanation under 120 words.',
      { search: true }
    );

    res.status(200).json({
      provider: 'Gemini',
      dataSource: 'Angel One SmartAPI',
      snapshot,
      summary: result.text,
      sources: result.sources,
    });
  } catch (error) {
    res.status(502).json({ error: error.message || 'Market insight request failed.' });
  }
}
