CREATE TABLE `music` (
	`file_id` integer PRIMARY KEY NOT NULL,
	`format` text NOT NULL,
	`duration` real NOT NULL,
	`sample_rate` integer NOT NULL,
	`channels` text NOT NULL,
	`resume_time` integer,
	FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON UPDATE no action ON DELETE cascade
);
