-- Better Auth 1.7 RC: restore accountId column name (providerAccountId was premature).
-- In-place RENAME COLUMN is atomic; SQLite updates indexes/uniques to the new column.
-- Skip FK-off DROP/recreate: D1 applies statements separately (no rollback window),
-- and PRAGMA foreign_keys does not persist across those statements.
ALTER TABLE `account` RENAME COLUMN `provider_account_id` TO `account_id`;
