CREATE TABLE `export_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer,
	`finishedAt` integer,
	`destinationFolder` text
);
