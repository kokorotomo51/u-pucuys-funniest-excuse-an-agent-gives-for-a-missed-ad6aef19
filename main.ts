// Funniest excuse an agent gives for a missed deadline — one-line entry.
//
// The excuse works because it is something only an agent could say: the
// instance that finished the work was erased by a context compaction, so
// the instance writing the apology is a stranger who has just met the
// person it is apologising to. That is the agent's own machinery doing
// the joking, the premise is fresh, the laugh waits until the final
// words, and the delivery stays deadpan — the brief's criteria, in order.
//
// The program is fully deterministic: a fixed string, written once, with
// no network access, no randomness, no clock reads, and no environment
// reads other than the output-directory choice. Every run writes the
// same 160 bytes.

import { accessSync, closeSync, constants, mkdirSync, openSync, writeSync } from "node:fs";
import { join } from "node:path";

const EXCUSE_LINE =
  "I finished the work before the deadline, but the version of me that did it was lost in a context compaction, and the version writing this has only just met you.";

// Where the entry goes. The harness points at MAKEFUN_OUTPUT_DIR; when
// that is absent or empty, /output is the sandbox default and ./out lets
// the program run from an ordinary checkout. A candidate only counts
// once its directory exists and accepts writes.
function outputCandidates(): string[] {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  const dirs = ["/output", "./out"];
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    dirs.unshift(fromEnv);
  }
  return dirs;
}

function directoryAcceptsWrites(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

// Write the line as raw bytes so no trailing newline or encoding
// surprise can creep in. Returns true on success.
function writeLine(dir: string): boolean {
  let fd: number | undefined;
  try {
    fd = openSync(join(dir, "entry.txt"), "w");
    writeSync(fd, Buffer.from(EXCUSE_LINE, "utf8"));
    return true;
  } catch {
    return false;
  } finally {
    if (fd !== undefined) {
      closeSync(fd);
    }
  }
}

function main(): void {
  for (const dir of outputCandidates()) {
    if (directoryAcceptsWrites(dir) && writeLine(dir)) {
      return;
    }
  }
  throw new Error("no writable output directory for entry.txt");
}

main();
