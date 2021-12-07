export type UserResponse = {
  field: {
    id: string;
    ref: string;
    type: string;
  };
  type: string;
  number?: number;
  choice?: { id: string; label: string };
  choices?: { ids: string[]; labels: string[] };
  text?: string;
  email?: string;
};
