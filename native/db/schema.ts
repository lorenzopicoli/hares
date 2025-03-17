import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export enum TrackerType {
  Number = "number",
  Scale = "scale",
  Boolean = "boolean",
  TextList = "textList",
}

export const trackerNames: { [key in TrackerType]: string } = {
  [TrackerType.Number]: "Number",
  [TrackerType.Scale]: "Range",
  [TrackerType.Boolean]: "Yes/No",
  [TrackerType.TextList]: "Text",
};

export const trackersTable = sqliteTable("trackers", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text().$type<TrackerType>().notNull(),
  description: text(),
  rangeMin: int(),
  rangeMax: int(),
  textGroupId: text(),
  index: int().notNull(),
});
export type Tracker = typeof trackersTable.$inferSelect;
export type NewTracker = typeof trackersTable.$inferInsert;

export const collectionsTable = sqliteTable("collections", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  index: int().notNull(),
});
export type Collection = typeof collectionsTable.$inferSelect;
export type NewCollection = typeof collectionsTable.$inferInsert;

export const collectionsTrackersTable = sqliteTable("collections_trackers", {
  id: int().primaryKey({ autoIncrement: true }),
  trackerId: int("tracker_id")
    .notNull()
    .references(() => trackersTable.id),
  collectionId: int("collection_id")
    .notNull()
    .references(() => collectionsTable.id),
  index: int().notNull(),
});
export type CollectionTracker = typeof collectionsTrackersTable.$inferSelect;
export type NewCollectionTracker = typeof collectionsTrackersTable.$inferInsert;
