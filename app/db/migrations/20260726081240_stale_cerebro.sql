-- Better Auth 1.7: accountId → providerAccountId, add required issuer
ALTER TABLE `account` RENAME COLUMN `account_id` TO `provider_account_id`;--> statement-breakpoint
ALTER TABLE `account` ADD `issuer` text;--> statement-breakpoint
UPDATE `account` SET `issuer` = 'local:credential' WHERE `provider_id` = 'credential';--> statement-breakpoint
UPDATE `account` SET `issuer` = 'local:oauth:' || `provider_id` WHERE `issuer` IS NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`access_token` text,
	`access_token_expires_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`id` text(36) PRIMARY KEY,
	`id_token` text,
	`issuer` text NOT NULL,
	`password` text,
	`provider_account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`scope` text,
	`updated_at` integer NOT NULL,
	`user_id` text(36) NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	CONSTRAINT `account_issuer_providerAccountId_uidx` UNIQUE(`issuer`,`provider_account_id`)
);
--> statement-breakpoint
INSERT INTO `__new_account`(`access_token`, `access_token_expires_at`, `created_at`, `id`, `id_token`, `issuer`, `password`, `provider_account_id`, `provider_id`, `refresh_token`, `refresh_token_expires_at`, `scope`, `updated_at`, `user_id`) SELECT `access_token`, `access_token_expires_at`, `created_at`, `id`, `id_token`, `issuer`, `password`, `provider_account_id`, `provider_id`, `refresh_token`, `refresh_token_expires_at`, `scope`, `updated_at`, `user_id` FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);
