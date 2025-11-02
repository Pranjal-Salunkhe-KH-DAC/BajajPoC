export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryResponse {
  success?: boolean;
  data?: Category[];
  total?: number;
}

export interface CategoryListResponse {
  success?: boolean;
  data?: Category[];
  total?: number;
  // For direct array responses
  [key: number]: Category;
}
