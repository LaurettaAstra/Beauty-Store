import { Link, useNavigate } from "react-router-dom"
import { products, type Product } from "../data/products"
import { ORDERS_KEY, type Order } from "./OrdersPage"

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect fill='%23e5e7eb' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%236b7280' text-anchor='middle' dy='.3em' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E"

export type CartItem = {
  productId: number
  quantity: number
  selected?: boolean
}

type CartPageProps = {
  cart: CartItem[]
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  toggleCartItemSelection: (productId: number) => void
  favoriteIds: number[]
  onToggleFavorite: (productId: number) => void
  onCreateOrder: (order: Order) => void
}

function CartPage({
  cart,
  removeFromCart,
  updateCartQuantity,
  toggleCartItemSelection,
  favoriteIds,
  onToggleFavorite,
  onCreateOrder,
}: CartPageProps) {
  const navigate = useNavigate()
  type CartItemWithProduct = { product: Product; quantity: number; selected?: boolean }
  const cartItems: CartItemWithProduct[] = cart
    .flatMap((item, index) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return []
      const productWithStock = index === 0 ? { ...product, stock: 0 } : product
      return [{ product: productWithStock, quantity: item.quantity, selected: item.selected }]
    })

  const isUnavailable = (p: Product) =>
    p.stock === 0 || p.is_available === false || (p as Product & { status?: string }).status === "out_of_stock"

  const cartItemsWithSelection = cartItems.map((item: CartItemWithProduct) => ({
    ...item,
    selected: isUnavailable(item.product) ? false : (item.selected ?? true),
  }))

  const availableCartItems = cartItemsWithSelection.filter(
    ({ product, selected }) => !isUnavailable(product) && selected
  )
  const canCheckout = availableCartItems.length > 0

  const handleCheckout = () => {
    if (!canCheckout) return
    let products_total = 0
    let discount_total = 0
    let final_total = 0

    const items = availableCartItems.map(({ product, quantity }) => {
      const price = product.old_price != null && product.old_price > product.price ? product.old_price : product.price
      const discount_amount_per_item = product.old_price != null && product.old_price > product.price ? product.old_price - product.price : 0
      const final_price = product.price

      const line_original_total = price * quantity
      const line_discount_total = discount_amount_per_item * quantity
      const line_final_total = final_price * quantity

      products_total += line_original_total
      discount_total += line_discount_total
      final_total += line_final_total

      return {
        product_id: product.id,
        title_snapshot: product.title,
        image_snapshot: product.image,
        unit_price: final_price,
        quantity,
        line_total: line_final_total,
        ...(discount_amount_per_item > 0 && {
          old_price: price,
          discount_percent: product.discount_percent,
        }),
      }
    })

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
        <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: 15 }}>
          <Link to="/" style={{ color: "#111827", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Назад в каталог
          </Link>
        </p>
        <h1 className="catalog-title" style={{ marginTop: 0 }}>Корзина</h1>
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
      <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: 15 }}>
        <Link to="/" style={{ color: "#111827", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          ← Назад в каталог
        </Link>
      </p>
      <h1 className="catalog-title" style={{ marginTop: 0 }}>Корзина</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 32 }}>
        {cartItemsWithSelection.map(({ product, quantity, selected }) => {
          const unavailable = isUnavailable(product)
          return (
          <div
            key={product.id}
            style={{
              display: "flex",
              gap: 16,
              background: "white",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 4 }}>
              <input
                type="checkbox"
                checked={selected}
                disabled={unavailable}
                onChange={() => toggleCartItemSelection(product.id)}
                style={{ width: 20, height: 20, accentColor: "#111827", cursor: unavailable ? "not-allowed" : "pointer" }}
                aria-label={selected ? "Исключить из заказа" : "Включить в заказ"}
              />
            </div>
            <div style={{ position: "relative", flexShrink: 0 }}>
              {unavailable && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.6)",
                      zIndex: 2,
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 16,
                      zIndex: 3,
                      pointerEvents: "none",
                    }}
                  >
                    <span
                      style={{
                        padding: "8px 16px",
                        background: "#e8e6e3",
                        color: "#4b5563",
                        fontSize: 14,
                        fontWeight: 600,
                        borderRadius: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Out of stock
                    </span>
                  </div>
                </>
              )}
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
                    ...(unavailable && { filter: "blur(12px) contrast(0.5)", opacity: 0.7 }),
                  }}
                  onError={(e) => {
                    const target = e.currentTarget
                    if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE
                  }}
                />
              </Link>
            </div>

            <div style={{ flex: 1, display: "flex", gap: 16, alignItems: "flex-start", minWidth: 0 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h3 className="product-title" style={{ margin: "0 0 8px" }}>{product.title}</h3>
                  </Link>
                  <p className="product-price" style={{ margin: "0 0 4px" }}>
                    {product.old_price != null && product.old_price > product.price ? (
                      <>
                        <span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: 8 }}>
                          {product.old_price * quantity} ₽
                        </span>
                        <span style={{ color: "#dc2626", fontWeight: 600 }}>
                          -{(product.old_price - product.price) * quantity} ₽
                        </span>
                        <br />
                        <span style={{ fontWeight: 700 }}>{product.price * quantity} ₽</span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 700 }}>{product.price * quantity} ₽</span>
                    )}
                  </p>
                  <p className="product-stock" style={{ margin: 0 }}>
                    {unavailable ? "Out of stock" : `В наличии: ${product.stock}`}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div className="quantity-controls" style={{ margin: 0 }}>
                    <button
                      type="button"
                      className="small-button"
                      disabled={unavailable}
                      onClick={() => updateCartQuantity(product.id, Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      type="button"
                      className="small-button"
                      disabled={unavailable}
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

              {unavailable && (
                <div
                  style={{
                    flexShrink: 0,
                    alignSelf: "center",
                    padding: "16px 32px",
                    background: "#f5f0e8",
                    borderRadius: 999,
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                    color: "#374151",
                    fontSize: 18,
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  К сожалению, товар закончился.
                  <br />
                  Мы обязательно уведомим вас, когда он снова будет в наличии!
                </div>
              )}
            </div>
          </div>
        )
        })}
      </div>

      {availableCartItems.length > 0 && (() => {
        const products_total = availableCartItems.reduce((sum, { product, quantity }) => {
          const price = product.old_price != null && product.old_price > product.price ? product.old_price : product.price
          return sum + price * quantity
        }, 0)
        const discount_total = availableCartItems.reduce((sum, { product, quantity }) => {
          const discount_per_item = product.old_price != null && product.old_price > product.price ? product.old_price - product.price : 0
          return sum + discount_per_item * quantity
        }, 0)
        const final_total = availableCartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)

        return (
          <div
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
              maxWidth: 360,
              marginBottom: 24,
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>Итоги</h2>
            <p style={{ margin: "0 0 8px", fontSize: 15, display: "flex", justifyContent: "space-between" }}>
              <span>Товары</span>
              <span>{products_total} ₽</span>
            </p>
            <p style={{ margin: "0 0 8px", fontSize: 15, display: "flex", justifyContent: "space-between" }}>
              <span>Скидка</span>
              <span style={{ color: discount_total > 0 ? "#dc2626" : "inherit" }}>
                {discount_total > 0 ? `-${discount_total}` : discount_total} ₽
              </span>
            </p>
            <p style={{ margin: "16px 0 0", fontSize: 18, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
              <span>К оплате</span>
              <span>{final_total} ₽</span>
            </p>
          </div>
        )
      })()}

      <button
        type="button"
        className="add-button"
        style={{
          width: 260,
          ...(!canCheckout && { opacity: 0.5, cursor: "not-allowed" }),
        }}
        disabled={!canCheckout}
        onClick={handleCheckout}
      >
        Оформить заказ
      </button>
    </main>
  )
}

export default CartPage
