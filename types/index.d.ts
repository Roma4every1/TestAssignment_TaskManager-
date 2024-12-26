export type Task = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: "inProgress" | "completed" | "canceled";
};

export const InitialState: Task = {
  id: "",
  title: "",
  description: "",
  location: "",
  date: "",
  status: "inProgress",
};
