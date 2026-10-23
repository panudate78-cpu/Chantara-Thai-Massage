import type { Db } from "./db";
import type { MediaStorage } from "./storage";
import type { Site } from "./seed";
import type { SessionUser } from "./auth";

export type CmsDeps = {
  db: Db;
  storage: MediaStorage;
};

export type PublicContext = {
  request: Request;
  url: URL;
  db: Db;
  storage: MediaStorage;
  site: Site;
};

export type AdminContext = PublicContext & {
  user: SessionUser;
};

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
