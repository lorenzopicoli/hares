PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer,
	`tracker_id` integer,
	`is_export` integer DEFAULT false NOT NULL,
	`days_of_week` text,
	`days_of_month` integer,
	`minute` integer,
	`hour` integer,
	`device_notification_id` text,
	FOREIGN KEY (`tracker_id`) REFERENCES `trackers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_notifications`("id", "createdAt", "tracker_id", "is_export", "days_of_week", "days_of_month", "minute", "hour", "device_notification_id") SELECT "id", "createdAt", "tracker_id", "is_export", "days_of_week", "days_of_month", "minute", "hour", "device_notification_id" FROM `notifications`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
ALTER TABLE `__new_notifications` RENAME TO `notifications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;