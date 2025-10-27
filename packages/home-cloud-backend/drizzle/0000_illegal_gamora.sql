CREATE TABLE `files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`path` text NOT NULL,
	`root_folder_id` integer NOT NULL,
	`size` integer NOT NULL,
	`topic` text,
	`title` text,
	`tags` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`indexed_at` integer DEFAULT (unixepoch()) NOT NULL,
	`last_opened_at` integer,
	FOREIGN KEY (`root_folder_id`) REFERENCES `root_folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `root_folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`is_removable` integer
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`file_id` integer PRIMARY KEY NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`duration` real NOT NULL,
	`format` text NOT NULL,
	`framerate` text NOT NULL,
	`aspect_ratio` text NOT NULL,
	`description` text,
	`resume_time` integer,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade
);
