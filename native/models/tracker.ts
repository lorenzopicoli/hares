export interface Tracker {
  id: string;
  name: string;
  type: "number" | "scale" | "boolean" | "text_list";
}

export interface Collection {
  id: string;
  name: string;
  trackers: Tracker[];
}
