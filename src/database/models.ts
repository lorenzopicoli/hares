export type TrackerType = "number" | "scale" | "boolean" | "option_list" | "text_list";
export type TimeOfDay = "morning" | "afternoon" | "night" | "all_day";

export interface DocBase {
  _id: string;
  _rev?: string;
  type: "tracker" | "collection" | "trackerEntry";
  deviceId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Tracker {
  type: "tracker";
  question: string;
  trackerType: TrackerType;
  options?: string[];
  order?: number;
}

export type TrackerDoc = Tracker & DocBase;

export interface Collection {
  type: "collection";
  name: string;
  trackers: string[];
}

export type CollectionDoc = Collection & DocBase;

export interface Entry {
  type: "trackerEntry";
  collectionId?: string;
  trackerId: string;
  value: string | number | boolean | string[];
  trackerType: TrackerType;
  timeOfDay?: TimeOfDay;
  exactTime?: string;
  date: Date;
}

export type EntryDoc = Entry & DocBase;
