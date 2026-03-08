export type Product = {
  id: number
  title: string
  price: number
  image: string
  stock: number
  description: string
}

export const products: Product[] = [
  {
    id: 1,
    title: "Крем для лица Hydra Beauty",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    stock: 3,
    description:
      "Увлажняющий крем для лица с легкой текстурой для ежедневного ухода. Помогает поддерживать комфорт кожи и мягкость в течение дня.",
  },
  {
    id: 2,
    title: "Шампунь Silk Repair",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    stock: 5,
    description:
      "Мягкий шампунь для очищения волос и поддержания гладкости по всей длине.",
  },
  {
    id: 3,
    title: "Сыворотка Glow Skin",
    price: 2700,
    image:
      "https://images.unsplash.com/photo-1556228578-dd6c7f1c7a16?auto=format&fit=crop&w=800&q=80",
    stock: 4,
    description:
      "Сыворотка для сияния кожи лица и выравнивания общего тона.",
  },
]