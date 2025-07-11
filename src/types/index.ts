import { TaskApiResponse } from "../schema/taskSchema";

export type RootStackParams = {
  Home: undefined;
  AddTask:
    | {
        task?: TaskApiResponse;
        mode?: 'create' | 'edit';
      }
    | undefined;
};
