CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trackers_grid_cols_number` integer DEFAULT 2 NOT NULL,
	`show_all_collection` integer DEFAULT true NOT NULL
);
