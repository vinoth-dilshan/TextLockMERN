export function expiryToDate(expiry) {
  const now = Date.now();

  const map = {
    "10m": 10 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "1w": 7 * 24 * 60 * 60 * 1000
  };

  const ms = map[expiry];
  if (!ms) throw new Error("Invalid expiry option");
  return new Date(now + ms);
}
