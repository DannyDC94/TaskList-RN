export type RootStackParams = {
  Home: undefined;
  AddTask:
    | {
        task?: Task;
        mode?: 'create' | 'edit';
      }
    | undefined;
};

export type Task = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
};
