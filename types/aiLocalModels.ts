export interface ModelsCollection {
  models: Model[];
}

export interface Model {
  context_length: number;
  details: Details;
  digest: string;
  expires_at: Date;
  model: string;
  name: string;
  size: number;
  size_vram: number;
}

export interface Details {
  families: string[];
  family: string;
  format: string;
  parameter_size: string;
  parent_model: string;
  quantization_level: string;
}
