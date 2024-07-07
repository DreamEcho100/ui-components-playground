export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  details: {
    lol: string;
    bruh: string;
    xd: string;
  };
  createdAt: string;
};

export type BasicPost = {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string | null;
  viewCount: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};
