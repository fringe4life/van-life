-- Better Auth 1.7.3: drop issuer unique + column. Identity is (providerId, accountId).
-- SQLite table UNIQUE cannot DROP INDEX; DROP COLUMN fails while the constraint remains.
-- No other table references `account`, so recreate is safe on D1 statement-by-statement apply.
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`access_token` text,
	`access_token_expires_at` integer,
	`account_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`id` text(36) PRIMARY KEY,
	`id_token` text,
	`password` text,
	`provider_id` text NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`scope` text,
	`updated_at` integer NOT NULL,
	`user_id` text(36) NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_account`(`access_token`, `access_token_expires_at`, `created_at`, `id`, `id_token`, `password`, `account_id`, `provider_id`, `refresh_token`, `refresh_token_expires_at`, `scope`, `updated_at`, `user_id`) SELECT `access_token`, `access_token_expires_at`, `created_at`, `id`, `id_token`, `password`, `account_id`, `provider_id`, `refresh_token`, `refresh_token_expires_at`, `scope`, `updated_at`, `user_id` FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);
