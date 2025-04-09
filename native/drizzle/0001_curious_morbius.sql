CREATE TABLE `entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tracker_id` integer NOT NULL,
	`date` integer,
	`periodOfDay` text,
	`timezone` text,
	FOREIGN KEY (`tracker_id`) REFERENCES `trackers`(`id`) ON UPDATE no action ON DELETE no action
);
