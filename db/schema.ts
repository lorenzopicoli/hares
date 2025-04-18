import { relations } from "drizzle-orm";
import { int, integer, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const DB_NAME = "hares.db";

export enum TrackerType {
  Number = "number",
  Scale = "scale",
  Boolean = "boolean",
  TextList = "textList",
}

export enum PeriodOfDay {
  Morning = "morning",
  Afternoon = "afternoon",
  Evening = "evening",
}

export type EntryDateInformation = { periodOfDay: PeriodOfDay } | { date: Date };

export const trackerNames: { [key in TrackerType]: string } = {
  [TrackerType.Number]: "Number",
  [TrackerType.Scale]: "Range",
  [TrackerType.Boolean]: "Yes/No",
  [TrackerType.TextList]: "Text",
};

export const trackerNamesToType = Object.keys(trackerNames).reduce(
  (acc, curr) => {
    acc[trackerNames[curr as TrackerType]] = curr as TrackerType;
    return acc;
  },
  {} as { [key: string]: TrackerType },
);

export const trackersTable = sqliteTable("trackers", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text().$type<TrackerType>().notNull(),
  prefix: text(),
  suffix: text(),
  description: text(),
  rangeMin: int(),
  rangeMax: int(),
  textGroupId: text(),
  index: int().notNull(),
  deletedAt: integer({ mode: "timestamp" }),
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

export const collectionsTrackersTable = sqliteTable(
  "collections_trackers",
  {
    id: int().primaryKey({ autoIncrement: true }),
    trackerId: int("tracker_id")
      .notNull()
      .references(() => trackersTable.id),
    collectionId: int("collection_id")
      .notNull()
      .references(() => collectionsTable.id),
    index: int().notNull(),
  },
  (t) => [unique().on(t.trackerId, t.collectionId)],
);

export type CollectionTracker = typeof collectionsTrackersTable.$inferSelect;
export type NewCollectionTracker = typeof collectionsTrackersTable.$inferInsert;

export const entriesTable = sqliteTable("entries", {
  id: int().primaryKey({ autoIncrement: true }),
  trackerId: int("tracker_id")
    .notNull()
    .references(() => trackersTable.id),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  date: integer({ mode: "timestamp" }),
  periodOfDay: text(),
  timezone: text(),
  numberValue: real(),
  booleanValue: integer(),
});

export const entriesRelations = relations(entriesTable, ({ many, one }) => ({
  textListValues: many(textListEntriesTable),
  tracker: one(trackersTable, {
    fields: [entriesTable.trackerId],
    references: [trackersTable.id],
  }),
}));

export type TrackerEntry = typeof entriesTable.$inferSelect & {
  textListValues?: Array<typeof textListEntriesTable.$inferSelect>;
  tracker?: typeof trackersTable.$inferSelect;
};
export type NewTrackerEntry = typeof entriesTable.$inferInsert;

export const textListEntriesTable = sqliteTable("text_list_entries", {
  id: int().primaryKey({ autoIncrement: true }),
  trackerId: int("tracker_id")
    .notNull()
    .references(() => trackersTable.id),
  entryId: int("entry_id")
    .notNull()
    .references(() => entriesTable.id),
  name: text().notNull(),
});

export const textListEntriesRelations = relations(textListEntriesTable, ({ one }) => ({
  textListValues: one(entriesTable, {
    fields: [textListEntriesTable.entryId],
    references: [entriesTable.id],
  }),
}));

export type TextListEntry = typeof textListEntriesTable.$inferSelect;
export type NewTextListEntry = typeof textListEntriesTable.$inferInsert;
