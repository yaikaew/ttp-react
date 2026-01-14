export interface ColumnConfig {
  key: string;
  label: string;
  type: "text" | "date" | "image" | "boolean" | "link" | "relation";
  relationTable?: string;
  relationDisplayKey?: string;
}

export interface TableConfig {
  id: string;
  name: string;
  importantColumns: string[]; // List of keys to show in table
}

export const TABLE_CONFIGS: Record<string, TableConfig> = {
  artist: {
    id: "artist",
    name: "ศิลปิน",
    importantColumns: ["id", "name"],
  },
  calendar: {
    id: "calendar",
    name: "ตารางงาน",
    importantColumns: ["date", "name", "artist_id"],
  },
  filmography: {
    id: "filmography",
    name: "ผลงานการแสดง",
    importantColumns: ["date", "title", "status", "artist_id"],
  },
  discography: {
    id: "discography",
    name: "ผลงานเพลง",
    importantColumns: ["date", "title", "artist_id"],
  },
  performance: {
    id: "performance",
    name: "การแสดง",
    importantColumns: ["date", "type", "title", "artist_id"],
  },
  magazines: {
    id: "magazines",
    name: "นิตยสาร",
    importantColumns: ["date", "name", "issue", "artist_id"],
  },
  endorsements: {
    id: "endorsements",
    name: "แบรนด์",
    importantColumns: ["date", "name", "artist_id"],
  },
  contents: {
    id: "contents",
    name: "คอนเทนต์",
    importantColumns: ["date", "type", "name", "artist_id"],
  },
  awards: {
    id: "awards",
    name: "รางวัล (Awards)",
    importantColumns: ["date", "award", "category", "result", "artist_id"],
  },
  filmographydetail: {
    id: "filmographydetail",
    name: "รายละเอียดผลงาน (Deep Detail)",
    importantColumns: ["filmography_id", "hashtag", "trailerid"],
  },
};
