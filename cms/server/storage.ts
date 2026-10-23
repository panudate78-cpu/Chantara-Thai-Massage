export type StoredObject = {
  data: Uint8Array;
  contentType: string;
};

export interface MediaStorage {
  put(key: string, data: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}

/** Minimal shape of a Netlify Blobs store (kept structural to avoid coupling). */
type BlobStoreLike = {
  set(
    key: string,
    value: ArrayBuffer | Uint8Array,
    options?: { metadata?: Record<string, string> }
  ): Promise<unknown>;
  getWithMetadata(
    key: string,
    options: { type: "arrayBuffer" }
  ): Promise<{ data: ArrayBuffer; metadata?: Record<string, unknown> } | null>;
  delete(key: string): Promise<unknown>;
};

export function createBlobStorage(store: BlobStoreLike): MediaStorage {
  return {
    async put(key, data, contentType) {
      await store.set(key, data, { metadata: { contentType } });
    },
    async get(key) {
      const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
      if (!result?.data) return null;
      const contentType =
        typeof result.metadata?.contentType === "string"
          ? result.metadata.contentType
          : "application/octet-stream";
      return { data: new Uint8Array(result.data), contentType };
    },
    async delete(key) {
      await store.delete(key);
    },
  };
}

/** In-memory storage used by tests and as a last-resort local fallback. */
export function createMemoryStorage(): MediaStorage {
  const files = new Map<string, StoredObject>();
  return {
    async put(key, data, contentType) {
      files.set(key, { data, contentType });
    },
    async get(key) {
      return files.get(key) ?? null;
    },
    async delete(key) {
      files.delete(key);
    },
  };
}
