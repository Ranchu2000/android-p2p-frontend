import { ModelTask } from "./ModelTask";
import { User } from "./User";
import { Dataset } from "./Dataset";

export interface Weight {
  weight_unique_identifier: string;
  model_task: ModelTask; // Assuming ModelTask is an enum or type
  weight_size: number;
  description?: string;
  last_trained: Date;
  is_uploaded: boolean;
  usage: number;
  likes: number;
  public_link?: string;
  architecture: string;
  creator?: string; // Relates to User
  combines_with?: Weight[]; // Array of Weight, combines with
  combined_into?: Weight[]; // Array of Weight, combined into
  evaluated_on?: Dataset[]; // Array of Dataset, evaluated on
  finetuned_from?: Dataset[]; // Array of Dataset, finetuned from
}
