import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { MediaStorage } from "./storage";

/** Local filesystem media storage used by the dev server (production uses Blobs). */
export function createFileStorage(rootDir: string): MediaStorage {
  const resolve = (key: string): string | null => {
    const parts = key.split("/");
    if (parts.some((part) => !part || part === "." || part === "..")) return null;
    return path.join(rootDir, ...parts);
  };

  return {
    async put(key, data, contentType) {
      const file = resolve(key);
      if (!file) throw new Error("Invalid storage key");
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, data);
      await writeFile(`${file}.meta`, contentType, "utf8");
    },
    async get(key) {
      const file = resolve(key);
      if (!file) return null;
      try {
        const data = await readFile(file);
        let contentType = "application/octet-stream";
        try {
          contentType = (await readFile(`${file}.meta`, "utf8")).trim();
        } catch {
          /* metadata is optional */
        }
        return { data: new Uint8Array(data), contentType };
      } catch {
        return null;
      }
    },
    async delete(key) {
      const file = resolve(key);
      if (!file) return;
      await rm(file, { force: true });
      await rm(`${file}.meta`, { force: true });
    },
  };
}
