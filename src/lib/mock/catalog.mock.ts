import type { Category, Product, ToppingGroup } from "@/types/product.types";

export const CATEGORIES: Category[] = [
  { id: "offers", name: "Special Offers", icon: "🔥" },
  { id: "pizzas", name: "Pizzas", icon: "🍕" },
  { id: "kebabs", name: "Kebabs", icon: "🌯" },
  { id: "crispy-chicken", name: "Crispy Chicken", icon: "🍗" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "championship", name: "Championship", icon: "🍟" },
  { id: "souces", name: "Souces", icon: "🥣" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "drinks", name: "Drinks", icon: "🥤" },
];

const PIZZA_TOPPINGS: ToppingGroup[] = [
  {
    id: "meat",
    name: "Meat",
    items: [
      { id: "pepperoni", name: "Pepperoni", price: 560 },
      { id: "ham", name: "Ham", price: 560, isDefault: true },
      { id: "bacon", name: "Bacon", price: 560, isDefault: true },
      { id: "hack", name: "Hack", price: 480 },
      { id: "tuna", name: "Tuna", price: 560, isDefault: true },
      { id: "shrimp", name: "Shrimp", price: 320 },
      { id: "parma-ham", name: "Parma Ham", price: 560 },
      { id: "chicken", name: "Chicken", price: 560, isDefault: true },
      { id: "mussel", name: "Mussel", price: 560 },
    ],
  },
  {
    id: "cheeses",
    name: "Cheeses",
    items: [
      { id: "cheese", name: "Cheese", price: 560, isDefault: true },
      { id: "cream-cheese", name: "Cream Cheese", price: 560, isDefault: true },
      { id: "pepper-cheese", name: "Pepper Cheese", price: 560 },
      { id: "blue-cheese", name: "Blue Cheese", price: 560 },
      { id: "parmesan", name: "Permesan", price: 560 },
      { id: "vegan-cheese", name: "Vegan Cheese", price: 560 },
      { id: "camembert", name: "Camembert", price: 560 },
      { id: "cheddar-cheese", name: "Cheddar Cheese", price: 560 },
    ],
  },
  {
    id: "vegetables",
    name: "Vegetables",
    items: [
      { id: "red-onion", name: "Red Onion", price: 560 },
      { id: "pineapple", name: "Pineapple", price: 560 },
      { id: "dates", name: "Dates", price: 560, isDefault: true },
      { id: "mushrooms", name: "Mushrooms", price: 560, isDefault: true },
      { id: "garlic", name: "Garlic", price: 560 },
      { id: "bananas", name: "Bananas", price: 560 },
      { id: "jalapeno", name: "Jalapeno", price: 560 },
      { id: "rock-lettuce", name: "Rock Lettuce", price: 560 },
      { id: "sun-dried-tomatoes", name: "Sun - Dried Tomatos", price: 560 },
      { id: "corn", name: "Corn", price: 560 },
      { id: "artichoke", name: "Artichoke", price: 560 },
      { id: "onion", name: "Onion", price: 560 },
      { id: "broccoli", name: "Broccoli", price: 560 },
      { id: "tomatoes", name: "Tomatoes", price: 560 },
    ],
  },
  {
    id: "spices-sauces",
    name: "Spices & Sauces",
    items: [
      { id: "sauce", name: "Sauce", price: 560, isDefault: true },
      { id: "garlic-sauce", name: "Garlic Sauce", price: 560 },
      { id: "garlic-salt", name: "Garlic Salt", price: 560 },
      { id: "jam", name: "Jam", price: 560 },
      { id: "chill-flakes", name: "Chill Flakes", price: 560 },
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "hawaiian",
    categoryId: "pizzas",
    name: "Hawaiian",
    description: "Ham, pineapple",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 3690, originalPrice: 4090 },
      { id: "12", label: '12"', price: 3090, originalPrice: 3490 },
      { id: "9", label: '9"', price: 2450, originalPrice: 2650 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "mexican",
    categoryId: "pizzas",
    name: "Mexican",
    description: "Cream cheese, Chicken, Onion, Corn, Garlic pepper, Garlic salt",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 4790 },
      { id: "12", label: '12"', price: 3850 },
      { id: "9", label: '9"', price: 3180 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "vegetarian",
    categoryId: "pizzas",
    name: "Vegetarian",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 3690 },
      { id: "12", label: '12"', price: 3050 },
      { id: "9", label: '9"', price: 2450 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "neapolitan",
    categoryId: "pizzas",
    name: "Neapolitan",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 3690 },
      { id: "12", label: '12"', price: 3050 },
      { id: "9", label: '9"', price: 2450 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "front-page-pizza",
    categoryId: "pizzas",
    name: "The front page pizza",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 3690 },
      { id: "12", label: '12"', price: 3050 },
      { id: "9", label: '9"', price: 2450 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "classic",
    categoryId: "pizzas",
    name: "Classic",
    description: "Pepperoni, Ham, Mushrooms, Onions",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 4690 },
      { id: "12", label: '12"', price: 3750 },
      { id: "9", label: '9"', price: 3050 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "florence",
    categoryId: "pizzas",
    name: "Florence",
    description: "Pepperoni, Onion, Tomatoes, Basil, Cream Cheese, Dates",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 4950 },
      { id: "12", label: '12"', price: 3950 },
      { id: "9", label: '9"', price: 3290 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "spring",
    categoryId: "pizzas",
    name: "Spring",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 3690 },
      { id: "12", label: '12"', price: 3050 },
      { id: "9", label: '9"', price: 2450 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "margarita",
    categoryId: "pizzas",
    name: "Margarita",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 3690 },
      { id: "12", label: '12"', price: 3050 },
      { id: "9", label: '9"', price: 2450 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "cheese-pizza",
    categoryId: "pizzas",
    name: "Cheese Pizza",
    description: "Camembert, Parmesan, Cream cheese, Blue cheese",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 4790 },
      { id: "12", label: '12"', price: 3850 },
      { id: "9", label: '9"', price: 3180 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "kebab-pizza",
    categoryId: "pizzas",
    name: "Kebab Pizza",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 4950 },
      { id: "12", label: '12"', price: 3950 },
      { id: "9", label: '9"', price: 3290 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "the-rose",
    categoryId: "pizzas",
    name: "The Rose",
    description: "Ham, Cheese, Bacon, Pineapple, Sauce",
    image: "🍕",
    variants: [
      { id: "15", label: '15"', price: 4690 },
      { id: "12", label: '12"', price: 3750 },
      { id: "9", label: '9"', price: 3050 },
    ],
    toppingGroups: PIZZA_TOPPINGS,
  },
  {
    id: "coke",
    categoryId: "drinks",
    name: "Coke",
    image: "🥤",
    variants: [
      { id: "0.5l", label: "0.5L", price: 280 },
      { id: "2l", label: "2L", price: 620 },
    ],
  },
  {
    id: "top-lemon",
    categoryId: "drinks",
    name: "Top Lemon",
    image: "🥤",
    variants: [{ id: "0.5l", label: "0.5L", price: 480 }],
  },
  {
    id: "coke-without-sugar",
    categoryId: "drinks",
    name: "Coke Without Sugar",
    image: "🥤",
    variants: [
      { id: "0.5l", label: "0.5L", price: 280 },
      { id: "2l", label: "2L", price: 620 },
    ],
  },
  {
    id: "fanta",
    categoryId: "drinks",
    name: "Fanta",
    image: "🥤",
    variants: [{ id: "0.5l", label: "0.5L", price: 220 }],
  },
  {
    id: "breadsticks-large",
    categoryId: "offers",
    name: "Breadsticks - Large",
    image: "🥖",
    variants: [{ id: "large", label: "Large", price: 890 }],
  },
  {
    id: "garlic-bread",
    categoryId: "offers",
    name: "Garlic Bread",
    image: "🍞",
    variants: [{ id: "medium", label: "Medium", price: 690 }],
  },
  {
    id: "crispy-chicken-box",
    categoryId: "crispy-chicken",
    name: "Crispy Chicken Box",
    image: "🍗",
    variants: [{ id: "regular", label: "Regular", price: 2990 }],
  },
  {
    id: "chicken-wings",
    categoryId: "crispy-chicken",
    name: "Chicken Wings",
    image: "🍗",
    variants: [{ id: "regular", label: "Regular", price: 2690 }],
  },
];

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

export function getPizzaProducts(): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === "pizzas");
}

export function getProductById(id: string): Product {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown mock product id: ${id}`);
  return product;
}
