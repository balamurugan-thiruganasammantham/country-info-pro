/**
 * Compute Levenshtein distance between two strings.
 * Uses single-row DP with optional early termination.
 */
export function levenshtein(a: string, b: string, maxDistance?: number): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Ensure a is the shorter string for space optimization
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const aLen = a.length;
  const bLen = b.length;

  // Early exit if length difference alone exceeds max
  if (maxDistance !== undefined && Math.abs(aLen - bLen) > maxDistance) {
    return maxDistance + 1;
  }

  const row: number[] = Array.from({ length: aLen + 1 }, (_, i) => i);

  for (let j = 1; j <= bLen; j++) {
    let prev = row[0];
    row[0] = j;
    let rowMin = row[0];

    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(
        row[i] + 1,       // deletion
        row[i - 1] + 1,   // insertion
        prev + cost        // substitution
      );
      prev = row[i];
      row[i] = val;
      if (val < rowMin) rowMin = val;
    }

    // Early termination
    if (maxDistance !== undefined && rowMin > maxDistance) {
      return maxDistance + 1;
    }
  }

  return row[aLen];
}

/**
 * Score how well a query matches a target string.
 * Returns a score between 0 and 1 (higher is better).
 */
export function fuzzyScore(query: string, target: string): number {
  if (query.length === 0 || target.length === 0) return 0;

  // Exact match
  if (query === target) return 1.0;

  // Prefix match
  if (target.startsWith(query)) {
    return 0.9 + 0.1 * (query.length / target.length);
  }

  // Substring match
  if (target.includes(query)) {
    return 0.7 * (query.length / target.length);
  }

  // Levenshtein distance
  const maxLen = Math.max(query.length, target.length);
  const maxDist = Math.ceil(maxLen * 0.6);
  const dist = levenshtein(query, target, maxDist);

  if (dist > maxDist) return 0;

  return Math.max(0, 1 - dist / maxLen);
}
