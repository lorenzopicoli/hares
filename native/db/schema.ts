import * as S from "@effect/schema/Schema";
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { NonEmptyString1000, String, createIndexes, database, id, table } from "@evolu/react-native";

// Let's start with the database schema.

// Every table needs Id. It's defined as a branded type.
// Branded types make database types super safe.
export const TrackerId = id("Tracker");
export type TrackerId = typeof TrackerId.Type;

export const CollectionId = id("CollectionId");
export type CollectionId = typeof CollectionId.Type;

// This branded type ensures a string must be validated before being put
// into the database.
export const NonEmptyString50 = String.pipe(S.minLength(1), S.maxLength(50), S.brand("NonEmptyString50"));
export type NonEmptyString50 = typeof NonEmptyString50.Type;

// Now we can define tables.
export const TrackerTable = table({
  id: TrackerId,
  name: NonEmptyString1000,
  question: NonEmptyString1000,
  collectionId: CollectionId,
});
export type TrackerTable = typeof TrackerTable.Type;

export const CollectionTable = table({
  id: CollectionId,
  name: NonEmptyString50,
});
export type CollectionTable = typeof CollectionTable.Type;

// Now, we can define the database schema.
export const Database = database({
  trackers: TrackerTable,
  collections: CollectionTable,
});
export type Database = typeof Database.Type;

/**
 * Indexes are not necessary for development but are required for production.
 * Before adding an index, use `logExecutionTime` and `logExplainQueryPlan`
 * createQuery options.
 *
 * See https://www.evolu.dev/docs/indexes
 */
export const indexes = createIndexes((create) => [
  //   create("indexTodoCreatedAt").on("todo").column("createdAt"),
  //   create("indexTodoCategoryCreatedAt").on("todoCategory").column("createdAt"),
]);
