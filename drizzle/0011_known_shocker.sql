CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tracker_id` integer NOT NULL,
	`is_export` integer DEFAULT false NOT NULL,
	`days_of_week` text,
	`days_of_month` integer,
	`minute` integer,
	`hour` integer,
	FOREIGN KEY (`tracker_id`) REFERENCES `trackers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `export_logs`;