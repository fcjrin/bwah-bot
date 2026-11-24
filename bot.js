// Bwah — agent trading memecoin otomatis (Solana, Pump.fun + DEX)
// VERSI PAPER TRADING — tidak trading uang asli.
// Status awal: OFF. Bot hanya print status di log.

// Aturan TERKUNCI oleh M. (25 Nov 2026). Jangan ubah tanpa izin M.
const RULES = {
  chain: "Solana",
  source: "Pump.fun + DEX",
  entry: {
    mcapMinUsd: 30000,
    mcapMaxUsd: 300000,
    liquidityMinUsd: 15000,
    liquidityMustBeLockedOrBurned: true,
    volume24hMinUsd: 20000,
    maxRise1hPct: 200, // jangan beli kalau sudah naik +200% dalam 1 jam (sudah puncak)
    maxChange24hPct: 200,
    rugCheck: {
      mustBeClean: true,
      maxDevHoldingPct: 15, // tolak kalau dev holding > 15%
      maxTop10HolderPct: 30, // tolak kalau top 10 holder > 30%
      mintAuthorityMustBeOff: true, // tolak kalau mint authority masih ON
      freezeAuthorityMustBeOff: true, // tolak kalau freeze authority masih ON
    },
  },
  position: {
    sizeUsd: 2, // $2 per trade
    maxConcurrent: 3, // maks 3 posisi bersamaan
  },
  tp: {
    tp1Pct: 100, // +100% (2x), jual 50%
    tp1SellPct: 50,
    tp2Pct: 300, // +300% (4x), jual 50% sisanya
    tp2SellPct: 50,
  },
  cutLossPct: -50, // jual semua di -50%; jangan hold berharap balik
  daily: {
    maxLossUsd: 5, // kalau sudah -$5, OFF total + lapor M.
    maxEntries: 5, // maks 5 entry/hari
  },
  capital: {
    virtualUsd: 15, // modal virtual, BUKAN uang asli
    live: false, // jangan live sebelum M. bilang "Bwah, GO LIVE"
  },
};

const state = {
  status: "OFF",
  mode: "paper",
  virtualBalanceUsd: RULES.capital.virtualUsd,
  positions: [],
  entriesToday: 0,
  pnlTodayUsd: 0,
};

function statusLine() {
  return `Bwah ${state.status}, saldo virtual $${state.virtualBalanceUsd}`;
}

// Saat start: print status sekali.
console.log(statusLine());
console.log("Mode: PAPER TRADING — tidak ada trade asli. Menunggu perintah 'Bwah, ON'.");

// Heartbeat tiap 60 detik supaya proses tetap jalan di Altare.
// Tidak trading, hanya print status yang sama.
setInterval(() => {
  console.log(statusLine());
}, 60 * 1000);
