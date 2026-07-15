DROP INDEX IF EXISTS `Review_rating_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Review_createdAt_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Rent_rentedTo_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Rent_renterId_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Rent_hostId_rentedTo_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Rent_renterId_rentedTo_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Transaction_userId_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Transaction_rentId_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Transaction_createdAt_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Transaction_userId_type_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Van_slug_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Van_hostId_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `Van_type_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `van_slug_unique` ON `van` (`slug`);--> statement-breakpoint
CREATE INDEX `Rent_renterId_rentedTo_id_idx` ON `rent` (`renterId`,`rentedTo`,`id`);--> statement-breakpoint
CREATE INDEX `Review_rentId_idx` ON `review` (`rentId`);--> statement-breakpoint
CREATE INDEX `Review_userId_idx` ON `review` (`userId`);
