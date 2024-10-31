import { ModelTask } from "./ModelTask"; 
import { User } from "./User";
import { Weight } from "./Weight";

export interface Dataset {
  uniqueIdentifier: string;
  is_public: boolean;
  class_labels: string[];
  model_task: ModelTask; // Assuming ModelTask is an enum or type
  public_link?: string;
  last_modified_date: Date;
  owner?: User; // Relates to User
  evaluated_by?: Weight[]; // Array of Weight, evaluated by
  finetuned_using?: Weight[]; // Array of Weight, finetuned by
}
