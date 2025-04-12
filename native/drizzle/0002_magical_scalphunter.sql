CREATE TABLE `text_list_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tracker_id` integer NOT NULL,
	`entry_id` integer NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`tracker_id`) REFERENCES `trackers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entry_id`) REFERENCES `entries`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `text_list_entries_name_unique` ON `text_list_entries` (`name`);--> statement-breakpoint
ALTER TABLE `entries` ADD `numberValue` real;--> statement-breakpoint
ALTER TABLE `entries` ADD `booleanValue` integer;