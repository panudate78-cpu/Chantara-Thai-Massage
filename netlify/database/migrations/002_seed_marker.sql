-- Records that the launch content has been written once, so an owner who
-- deletes a treatment (or all of them) does not get the defaults restored on
-- the next cold start.
alter table sites
  add column if not exists content_seeded_at timestamptz;
