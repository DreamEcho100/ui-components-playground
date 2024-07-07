export type BasicPost = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  viewCount: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};
