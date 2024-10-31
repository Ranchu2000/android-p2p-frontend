import { Dataset } from "./Dataset";
import { Weight } from "./Weight";

export interface User {
  username: string;
  password: string;
  datasets?: Dataset[]; // Array of Dataset, owned by the user
  weights?: Weight[]; // Array of Weight, created by the user
}
