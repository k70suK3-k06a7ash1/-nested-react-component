// 型定義
export interface Item {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Category[];
  items: Item[];
}

export interface State {
  categories: Category;
}
