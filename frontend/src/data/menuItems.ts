export type MenuItem = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "matcha",
    name: "\u0645\u0627\u0686\u0627",
    category: "matcha",
    imageUrl: "/images/matcha-hero.JPG",
  },
  {
    id: "matcha-tea",
    name: "\u0646\u0648\u0634\u06cc\u062f\u0646\u06cc\u200c\u0647\u0627\u06cc \u0645\u0627\u0686\u0627",
    category: "matcha-tea",
    imageUrl: "/images/matcha-tea.png",
  },
  {
    id: "coffee",
    name: "\u0642\u0647\u0648\u0647",
    category: "coffee",
    imageUrl: "/images/coffee-beans.png",
  },
  {
    id: "cold-brew",
    name: "\u06a9\u0648\u0644\u062f \u0628\u0631\u0648",
    category: "cold-brew",
    imageUrl: "/images/cold-brew.png",
  },
  {
    id: "accessories",
    name: "\u0627\u06a9\u0633\u0633\u0648\u0631\u06cc",
    category: "accessories",
    imageUrl: "/images/accessories.png",
  },
];
