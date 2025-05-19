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

export type EntryDateInformation = { periodOfDay?: PeriodOfDay; date?: Date; now?: true };

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
  comment: text(),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  date: integer({ mode: "timestamp" }),
  periodOfDay: text(),
  timezone: text(),
  numberValue: real(),
  booleanValue: integer({ mode: "boolean" }),
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

export const trackersRelations = relations(trackersTable, ({ many }) => ({
  entries: many(entriesTable),
  collections: many(collectionsTrackersTable),
  notifications: many(notificationsTable),
}));

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

export const settingsTable = sqliteTable("settings", {
  id: int().primaryKey({ autoIncrement: true }),
  trackersGridColsNumber: int("trackers_grid_cols_number").notNull().default(2),
  showAllCollection: int("show_all_collection", { mode: "boolean" }).notNull().default(true),
});

export type Settings = typeof settingsTable.$inferSelect;
export type NewSettings = typeof settingsTable.$inferInsert;

export enum NotificationType {
  EveryDay = "EveryDay",
  DaysOfWeek = "DaysOfWeek",
  DaysOfMonth = "DaysOfMonth",
}

export interface NotificationRecurrence {
  type: NotificationType;
  time: Date;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export const notificationsTable = sqliteTable("notifications", {
  id: int().primaryKey({ autoIncrement: true }),
  createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
  trackerId: int("tracker_id")
    .notNull()
    .references(() => trackersTable.id),
  isExport: integer("is_export", { mode: "boolean" }).notNull().default(false),
  /**
   * Comma separated integers representing the day of the week
   */
  daysOfWeek: text("days_of_week"),
  daysOfMonth: integer("days_of_month"),
  minute: integer("minute"),
  hour: integer("hour"),
  deviceNotificationId: text("device_notification_id"),
});

export type UnprocessedNotification = typeof notificationsTable.$inferSelect;
export type NewNotification = typeof notificationsTable.$inferInsert;
export type Notification = Omit<typeof notificationsTable.$inferSelect, "deviceNotificationId" | "daysOfWeek"> & {
  daysOfWeek: number[] | null;
  deviceNotificationId: string[] | null;
};

export const notificationsRelations = relations(notificationsTable, ({ many, one }) => ({
  tracker: one(trackersTable, {
    fields: [notificationsTable.trackerId],
    references: [trackersTable.id],
  }),
}));
