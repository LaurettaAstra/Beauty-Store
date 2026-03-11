const CART_KEY = "cart"
const API_BASE = import.meta.env.VITE_API_URL ?? ""

export type CartItemApi = {
  product_id: number
  quantity: number
}

export type CartApiResponse = {
  items: CartItemApi[]
}

export async function getCart(): Promise<CartItemApi[]> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/cart`)
      if (!res.ok) return []
      const data: CartApiResponse = await res.json()
      return data.items ?? []
    } catch {
      return []
    }
  }

  try {
    const raw = localStorage.getItem(CART_KEY) || "[]"
    const cart: { productId: number; quantity: number }[] = JSON.parse(raw)
    return cart.map((i) => ({ product_id: i.productId, quantity: i.quantity }))
  } catch {
    return []
  }
}

export async function postCartItems(productId: number, quantity: number): Promise<void> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, quantity }),
    })
    if (!res.ok) throw new Error("Failed to add to cart")
    return
  }

  const cart: { productId: number; quantity: number; selected?: boolean }[] = JSON.parse(
    localStorage.getItem(CART_KEY) || "[]"
  )
  const existing = cart.find((i) => i.productId === productId)
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 999)
  } else {
    cart.push({ productId: productId, quantity, selected: true })
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}
