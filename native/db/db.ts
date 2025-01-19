import { type NotNull, cast, createEvolu, jsonArrayFrom } from "@evolu/react-native";
import { Database, indexes } from "./schema";

export * from "./schema";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createDatabase = () =>
  createEvolu(Database, {
    indexes,
    ...(process.env.NODE_ENV === "development" && {
      syncUrl: "",
      //   enableWebsocketConnection: true,
    }),
    initialData: (evolu) => {},

    // minimumLogLevel: "trace",
  });

export const evolu = createDatabase();

export const trackers = evolu.createQuery((db) =>
  db
    .selectFrom("trackers")
    .select(["id", "name", "question"])
    .where("isDeleted", "is not", cast(true))
    .where("name", "is not", null)
    .$narrowType<{ name: NotNull }>()
    .orderBy("createdAt"),
);

// Evolu queries should be collocated. If necessary, they can be preloaded.
export const collectionsWithTrackers = evolu.createQuery(
  (db) =>
    db
      .selectFrom("collections")
      .select(["id", "name"])
      .where("isDeleted", "is not", cast(true))
      // Filter null value and ensure non-null type.
      .where("name", "is not", null)
      .$narrowType<{ name: NotNull }>()
      .orderBy("createdAt")
      // https://kysely.dev/docs/recipes/relations
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("trackers")
            .select(["collections.id", "trackers.collectionId"])
            .where("isDeleted", "is not", cast(true))
            .orderBy("createdAt"),
        ).as("trackers"),
      ]),
  {
    logQueryExecutionTime: true,
    // logExplainQueryPlan: true,
  },
);
