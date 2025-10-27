ALTER TABLE `files` RENAME COLUMN "path" TO "dirname";--> statement-breakpoint
ALTER TABLE `root_folders` ADD `device_uuid` text;--> statement-breakpoint
ALTER TABLE `root_folders` ADD `label` text;--> statement-breakpoint
ALTER TABLE `root_folders` ADD `fs_type` text;--> statement-breakpoint
ALTER TABLE `root_folders` ADD `protocol` text;--> statement-breakpoint
ALTER TABLE `root_folders` ADD `physical` text;--> statement-breakpoint
ALTER TABLE `root_folders` ADD `indexed_at` integer DEFAULT (unixepoch()) NOT NULL;--> statement-breakpoint
ALTER TABLE `root_folders` DROP COLUMN `is_removable`;