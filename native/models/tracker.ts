export enum TrackerType {
  Number = "number",
  Scale = "scale",
  Boolean = "boolean",
  TextList = "textList",
}

export interface Tracker {
  id: string;
  name: string;
  description: string;
  type: TrackerType;
  scaleMin?: number;
  scaleMax?: number;
  textGroup?: string;
}

export interface Collection {
  id: string;
  name: string;
  trackers: Tracker[];
}
