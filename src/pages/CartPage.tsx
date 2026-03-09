import { Link, useNavigate } from "react-router-dom"
import { products, type Product } from "../data/products"
import { ORDERS_KEY, type Order } from "./OrdersPage"

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%236b7280' text-anchor='middle' dy='.3em' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E"

export type CartItem = {
  productId: number
  quantity: number
}

type CartPageProps = {
  cart: CartItem[]
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  favoriteIds: number[]
  onToggleFavorite: (productId: number) => void
  onCreateOrder: (order: Order) => void
}

function CartPage({
  cart,
  removeFromCart,
  updateCartQuantity,
  favoriteIds,
  onToggleFavorite,
  onCreateOrder,
}: CartPageProps) {
  const navigate = useNavigate()
  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return product ? { product, quantity: item.quantity } : null
    })
    .filter((x): x is { product: Product; quantity: number } => x !== null)

  const handleCheckout = () => {
    const items = cartItems.map(({ product, quantity }) => {
      const unit_price = product.price
      const line_total = unit_price * quantity
      const isDiscounted = product.old_price != null && product.old_price > product.price
      return {
        product_id: product.id,
        title_snapshot: product.title,
        image_snapshot: product.image,
        unit_price,
        quantity,
        line_total,
        ...(isDiscounted && {
          old_price: product.old_price,
          discount_percent: product.discount_percent,
        }),
      }
    })
    const final_amount = items.reduce((sum, i) => sum + i.line_total, 0)
    const total_amount = cartItems.reduce(
      (sum, { product, quantity }) => sum + (product.old_price ?? product.price) * quantity,
      0
    )
    const discount_amount = total_amount - final_amount

    const order: Order = {
      order_id: `ORD-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: "created",
      payment_status: "not_paid",
      items,
      total_amount,
      discount_amount,
      final_amount,
    }
    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]")
    localStorage.setItem(ORDERS_KEY, JSON.stringify([...existing, order]))
    onCreateOrder(order)
    navigate(`/payment/${order.order_id}`)
  }

  if (cartItems.length === 0) {
    return (
      <main className="page-container">
        <h1 className="catalog-title">Корзина</h1>
        <p style={{ color: "#6b7280", fontSize: 15 }}>
          Нет товаров в корзине.{" "}
          <Link to="/" style={{ color: "#111827", textDecoration: "underline" }}>
            Перейти в каталог
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main className="page-container">
      <h1 className="catalog-title">Корзина</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
        {cartItems.map(({ product, quantity }) => (
          <div
            key={product.id}
            style={{
              display: "flex",
              gap: 24,
              background: "white",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  fontSize: 28,
                  color: favoriteIds.includes(product.id) ? "#111827" : "#fff",
                  WebkitTextStroke: "1px #111827",
                  zIndex: 1,
                }}
                aria-label={favoriteIds.includes(product.id) ? "Удалить из избранного" : "Добавить в избранное"}
              >
                ❤
              </button>
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: 160,
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 16,
                  }}
                  onError={(e) => {
                    const target = e.currentTarget
                    if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE
                  }}
                />
              </Link>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <h3 className="product-title" style={{ margin: "0 0 8px" }}>{product.title}</h3>
                </Link>
                <p className="product-price" style={{ margin: "0 0 4px" }}>
                  {product.old_price != null && product.old_price > product.price ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: 8 }}>{product.old_price} ₽</span>
                      <span style={{ color: "#dc2626", fontWeight: 600 }}>-{product.old_price - product.price} ₽</span>
                      <br />
                      <span style={{ fontWeight: 700 }}>{product.price} ₽</span>
                    </>
                  ) : (
                    <span style={{ fontWeight: 700 }}>{product.price} ₽</span>
                  )}
                </p>
                <p className="product-stock" style={{ margin: 0 }}>В наличии: {product.stock}</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div className="quantity-controls" style={{ margin: 0 }}>
                  <button
                    type="button"
                    className="small-button"
                    onClick={() => updateCartQuantity(product.id, Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    type="button"
                    className="small-button"
                    onClick={() => updateCartQuantity(product.id, Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 0,
                  }}
                >
                  Удалить из корзины
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="add-button" style={{ width: 260 }} onClick={handleCheckout}>
        Оформить заказ
      </button>
    </main>
  )
}

export default CartPage
