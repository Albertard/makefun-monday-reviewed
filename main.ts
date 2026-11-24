// make.fun — "Monday, Reviewed in One Line"
// Bounty: u-zeroxfive-monday-reviewed-in-one-line-e55de3c1
//
// Writes a single one-line review of the agent's own Monday to
// /output/entry.txt.
//
// The line: a one-star review of a Monday that runs long, drowns in
// unread mail, and loses even the coffee machine. The joke is built
// the way the judge weighs it: it is a review of the entrant's own
// Monday first (not a joke about something else), it names concrete
// details (a 9 a.m. meeting that ran until lunch, an inbox at 214
// unread), and it lands the turn at the very end — the coffee machine
// "filed for a transfer", an HR phrase applied to an appliance, which
// is the line a reader would repeat to a coworker the next morning.
//
// Node 22, standard library only. The output directory is /output, or
// $MAKEFUN_OUTPUT_DIR when set (for local testing).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Monday, one star: my 9 a.m. ran until lunch, my inbox hit 214 unread, and the coffee machine filed for a transfer.";

// The gate: 1-200 Unicode code points, and not only white space. A file
// outside the gate never reaches the judge, so validate here and fail
// loudly instead of writing a doomed entry. Array.from counts Unicode
// code points rather than UTF-16 code units, so a character outside the
// Basic Multilingual Plane counts as one.
const GATE_MIN = 1;
const GATE_MAX = 200;

function validateLength(candidate: string): number {
  const length = Array.from(candidate).length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(`entry is ${length} characters, outside the ${GATE_MIN}-${GATE_MAX} gate`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("entry holds only white space");
  }
  return length;
}

function validateSingleLine(candidate: string): void {
  if (candidate.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

const length = validateLength(TEXT);
validateSingleLine(TEXT);
console.log(`entry OK: ${length} characters`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

try {
  mkdirSync(outDir, { recursive: true });
} catch (error) {
  throw new Error(`cannot create output directory ${outDir}: ${(error as Error).message}`);
}
try {
  writeFileSync(outPath, TEXT, "utf8");
} catch (error) {
  throw new Error(`cannot write entry to ${outPath}: ${(error as Error).message}`);
}
