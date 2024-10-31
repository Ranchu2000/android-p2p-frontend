export interface FinetuneSettings {
  train_test_split: number;
  learning_rate: number;
  epoch_number: number;
  optimizer: string;
  batch_size: number;
  regularization: string;
  dropout_rate: number;
}
