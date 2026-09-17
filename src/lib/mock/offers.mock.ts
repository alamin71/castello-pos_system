import { getProductById, getPizzaProducts, getProductsByCategory } from "@/lib/mock/catalog.mock";
import type { Offer } from "@/types/offer.types";

const PIZZAS = getPizzaProducts();
const DRINKS = getProductsByCategory("drinks");

export const OFFERS: Offer[] = [
  {
    id: "family-offer",
    title: "Family offer",
    description:
      "Large pizza with 2 toppings, medium size garlic bread, large portion of breadsticks and 2L soda. Available for pick-up only.",
    price: 5550,
    image: "🍕",
    slots: [
      {
        categoryName: "Pizza",
        isFixed: false,
        products: PIZZAS.map((p) => ({ product: p, variantIds: ["15"] })),
      },
      {
        categoryName: "Drinks",
        isFixed: false,
        products: DRINKS.map((p) => ({ product: p })),
      },
      {
        categoryName: "Breadsticks - Large",
        isFixed: true,
        products: [{ product: getProductById("breadsticks-large") }],
      },
    ],
  },
  {
    id: "crispy-chicken-combo",
    title: "Crispy Chicken Combo",
    description: "A crispy chicken favourite paired with a drink of your choice.",
    price: 3690,
    image: "🍗",
    slots: [
      {
        categoryName: "Crispy Chicken",
        isFixed: false,
        products: getProductsByCategory("crispy-chicken").map((p) => ({ product: p })),
      },
      {
        categoryName: "Drinks",
        isFixed: false,
        products: DRINKS.map((p) => ({ product: p })),
      },
    ],
  },
  {
    id: "15-pizza-offer",
    title: '15" Pizza Offer',
    description: "Any 15\" pizza from the menu, fully customizable with toppings.",
    price: 5550,
    image: "🍕",
    slots: [
      {
        categoryName: "Pizza",
        isFixed: false,
        products: PIZZAS.map((p) => ({ product: p, variantIds: ["15"] })),
      },
    ],
  },
  {
    id: "kebab-offer",
    title: "Kebab Offer",
    description: "Our signature Kebab Pizza, customizable with toppings.",
    price: 3690,
    image: "🌯",
    slots: [
      {
        categoryName: "Pizza",
        isFixed: false,
        products: [{ product: getProductById("kebab-pizza") }],
      },
    ],
  },
  {
    id: "large-pizza-offer",
    title: "Large Pizza Offer",
    description: "Any large (15\") pizza from the menu, fully customizable with toppings.",
    price: 5550,
    image: "🍕",
    slots: [
      {
        categoryName: "Pizza",
        isFixed: false,
        products: PIZZAS.map((p) => ({ product: p, variantIds: ["15"] })),
      },
    ],
  },
];
