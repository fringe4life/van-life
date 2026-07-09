CREATE TABLE `account` (
	`access_token` text,
	`access_token_expires_at` integer,
	`account_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`id` text PRIMARY KEY,
	`id_token` text,
	`password` text,
	`provider_id` text NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`scope` text,
	`updated_at` integer NOT NULL,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `rent` (
	`hostId` text NOT NULL,
	`id` text PRIMARY KEY,
	`rentedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`rentedTo` integer,
	`renterId` text NOT NULL,
	`vanId` text NOT NULL,
	CONSTRAINT `fk_rent_hostId_user_id_fk` FOREIGN KEY (`hostId`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_rent_renterId_user_id_fk` FOREIGN KEY (`renterId`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_rent_vanId_van_id_fk` FOREIGN KEY (`vanId`) REFERENCES `van`(`id`)
);
--> statement-breakpoint
CREATE TABLE `review` (
	`createdAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`id` text PRIMARY KEY,
	`rating` integer NOT NULL,
	`rentId` text NOT NULL,
	`text` text NOT NULL,
	`updatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`userId` text NOT NULL,
	CONSTRAINT `fk_review_rentId_rent_id_fk` FOREIGN KEY (`rentId`) REFERENCES `rent`(`id`),
	CONSTRAINT `fk_review_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY,
	`ip_address` text,
	`token` text NOT NULL UNIQUE,
	`updated_at` integer NOT NULL,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `transaction` (
	`amount` real NOT NULL,
	`createdAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`description` text,
	`id` text PRIMARY KEY,
	`rentId` text,
	`type` text NOT NULL,
	`userId` text NOT NULL,
	CONSTRAINT `fk_transaction_rentId_rent_id_fk` FOREIGN KEY (`rentId`) REFERENCES `rent`(`id`),
	CONSTRAINT `fk_transaction_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`id` text PRIMARY KEY,
	`image` text,
	`name` text NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `van` (
	`createdAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`description` text NOT NULL,
	`discount` integer DEFAULT 0,
	`hostId` text NOT NULL,
	`id` text PRIMARY KEY,
	`imageUrl` text NOT NULL,
	`isRented` integer DEFAULT false NOT NULL,
	`name` text NOT NULL UNIQUE,
	`price` integer NOT NULL,
	`slug` text NOT NULL,
	`state` text DEFAULT 'AVAILABLE',
	`type` text NOT NULL,
	CONSTRAINT `fk_van_hostId_user_id_fk` FOREIGN KEY (`hostId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`expires_at` integer NOT NULL,
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `Rent_rentedTo_idx` ON `rent` (`rentedTo`);--> statement-breakpoint
CREATE INDEX `Rent_vanId_idx` ON `rent` (`vanId`);--> statement-breakpoint
CREATE INDEX `Rent_renterId_idx` ON `rent` (`renterId`);--> statement-breakpoint
CREATE INDEX `Rent_hostId_idx` ON `rent` (`hostId`);--> statement-breakpoint
CREATE INDEX `Rent_renterId_rentedTo_idx` ON `rent` (`renterId`,`rentedTo`);--> statement-breakpoint
CREATE INDEX `Rent_hostId_rentedTo_idx` ON `rent` (`hostId`,`rentedTo`);--> statement-breakpoint
CREATE INDEX `Review_rating_idx` ON `review` (`rating`);--> statement-breakpoint
CREATE INDEX `Review_createdAt_idx` ON `review` (`createdAt`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `Transaction_userId_idx` ON `transaction` (`userId`);--> statement-breakpoint
CREATE INDEX `Transaction_rentId_idx` ON `transaction` (`rentId`);--> statement-breakpoint
CREATE INDEX `Transaction_createdAt_idx` ON `transaction` (`createdAt`);--> statement-breakpoint
CREATE INDEX `Transaction_userId_type_idx` ON `transaction` (`userId`,`type`);--> statement-breakpoint
CREATE INDEX `Transaction_userId_createdAt_idx` ON `transaction` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `Transaction_userId_amount_idx` ON `transaction` (`userId`,`amount`);--> statement-breakpoint
CREATE INDEX `Transaction_userId_type_createdAt_idx` ON `transaction` (`userId`,`type`,`createdAt`);--> statement-breakpoint
CREATE INDEX `Transaction_userId_type_amount_idx` ON `transaction` (`userId`,`type`,`amount`);--> statement-breakpoint
CREATE INDEX `Van_slug_idx` ON `van` (`slug`);--> statement-breakpoint
CREATE INDEX `Van_hostId_idx` ON `van` (`hostId`);--> statement-breakpoint
CREATE INDEX `Van_type_idx` ON `van` (`type`);--> statement-breakpoint
CREATE INDEX `Van_hostId_id_idx` ON `van` (`hostId`,`id`);--> statement-breakpoint
CREATE INDEX `Van_type_id_idx` ON `van` (`type`,`id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);