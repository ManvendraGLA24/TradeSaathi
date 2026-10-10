import test from 'node:test';
import assert from 'node:assert/strict';

const { decodePacket } = await import('../lib/api/_marketStream.js');

test('Angel One quote packets decode live prices and quote fields', () => {
  const packet = Buffer.alloc(123);
  packet.writeUInt8(2, 0);
  packet.writeUInt8(1, 1);
  packet.write('2885', 2, 'ascii');
  packet.writeBigInt64LE(123n, 27);
  packet.writeBigInt64LE(456n, 35);
  packet.writeBigInt64LE(123456n, 43);
  packet.writeBigInt64LE(9000n, 67);
  packet.writeBigInt64LE(120000n, 91);
  packet.writeBigInt64LE(125000n, 99);
  packet.writeBigInt64LE(119000n, 107);
  packet.writeBigInt64LE(122000n, 115);

  const tick = decodePacket(packet);
  assert.deepEqual({ ...tick, receivedAt: undefined }, {
    type: 'tick',
    symbol: 'RELIANCE',
    exchange: 'NSE',
    ltp: 1234.56,
    sequence: '123',
    exchangeTimestamp: '456',
    receivedAt: undefined,
    volume: 9000,
    open: 1200,
    high: 1250,
    low: 1190,
    close: 1220,
  });
  assert.equal(Number.isFinite(tick.receivedAt), true);
});

test('Angel One snap-quote packets decode open interest at its protocol offset', () => {
  const packet = Buffer.alloc(139);
  packet.writeUInt8(3, 0);
  packet.writeUInt8(1, 1);
  packet.write('2885', 2, 'ascii');
  packet.writeBigInt64LE(7654321n, 131);

  assert.equal(decodePacket(packet).oi, 7654321);
});

test('Angel One stream ignores malformed and untracked packets', () => {
  const short = Buffer.alloc(12);
  const unknown = Buffer.alloc(51);
  unknown.writeUInt8(1, 0);
  unknown.writeUInt8(1, 1);
  unknown.write('000000', 2, 'ascii');

  assert.equal(decodePacket(short), null);
  assert.equal(decodePacket(unknown), null);
});
