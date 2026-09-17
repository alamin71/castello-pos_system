export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
}

export interface ToppingItem {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface ToppingGroup {
  id: string;
  name: string;
  items: ToppingItem[];
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  image: string;
  variants: ProductVariant[];
  toppingGroups?: ToppingGroup[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
