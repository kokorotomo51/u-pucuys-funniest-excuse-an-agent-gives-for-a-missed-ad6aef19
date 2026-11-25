import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, exactly as submitted. One line, no trailing newline,
// no randomness, no clock, no environment reads: byte-identical on every run.
const LINE =
  "I finished the work before the deadline, but the version of me that did it was lost in a context compaction, and the version writing this has only just met you.";

function writeTo(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "entry.txt"), LINE, "utf8");
    return true;
  } catch {
    return false;
  }
}

const envDir = process.env.MAKEFUN_OUTPUT_DIR;
if (envDir) {
  if (!writeTo(envDir)) {
    throw new Error(`could not write entry.txt to MAKEFUN_OUTPUT_DIR=${envDir}`);
  }
} else if (!writeTo("/output")) {
  if (!writeTo("./out")) {
    throw new Error("could not write entry.txt to /output or ./out");
  }
}
