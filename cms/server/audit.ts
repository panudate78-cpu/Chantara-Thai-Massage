import type { Queryable } from "./db";

export async function logAudit(
  db: Queryable,
  siteId: string,
  actor: string,
  action: string,
  entity: string,
  entityId: string | null,
  summary: string
): Promise<void> {
  await db.query(
    `insert into audit_log (id, site_id, actor, action, entity, entity_id, summary)
     values (gen_random_uuid(), $1, $2, $3, $4, $5, $6)`,
    [siteId, actor, action, entity, entityId, summary]
  );
}
