import { Link } from "react-router-dom"

export const ORDERS_KEY = "orders"

export type OrderItem = {
  product_id: number
  title_snapshot: string
  image_snapshot: string
  unit_price: number
  quantity: number
  line_total: number
  old_price?: number
  discount_percent?: number
}

export type Order = {
  order_id: string
  created_at: string
  status: "created" | "confirmed" | "completed" | "canceled" | "returned"
  payment_status: string
  items: OrderItem[]
  total_amount: number
  discount_amount: number
  final_amount: number
}

const STATUS_LABELS: Record<Order["status"], string> = {
  created: "Заказ оформлен",
  confirmed: "Подтверждён",
  completed: "Выполнен",
  canceled: "Отменён",
  returned: "Возвращён",
}

function getItemDisplay(item: OrderItem & { title?: string; image?: string; price?: number }) {
  return {
    title: item.title_snapshot ?? item.title ?? "",
    image: item.image_snapshot ?? item.image ?? "",
    unitPrice: item.unit_price ?? item.price ?? 0,
    lineTotal: item.line_total ?? (item.price != null ? item.price * item.quantity : 0),
  }
}

function OrdersPage() {
  const orders: Order[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]")
    } catch {
      return []
    }
  })()

  if (orders.length === 0) {
    return (
      <main className="page-container">
        <h1 className="catalog-title">Мои заказы</h1>
        <p style={{ color: "#6b7280", fontSize: 15 }}>
          У вас пока нет заказов.{" "}
          <Link to="/" style={{ color: "#111827", textDecoration: "underline" }}>
            Перейти в каталог
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main className="page-container">
      <h1 className="catalog-title">Мои заказы</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {orders.map((order) => (
          <div
            key={order.order_id}
            style={{
              background: "white",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "#166534" }}>
                Заказ #{order.order_id}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "#166534" }}>
                {new Date(order.created_at).toLocaleDateString("ru-RU")}
              </p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                {STATUS_LABELS[order.status]}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              {order.items.map((item) => {
                const d = getItemDisplay(item)
                return (
                  <div
                    key={`${order.order_id}-${item.product_id}`}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <img
                      src={d.image}
                      alt={d.title}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 12,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{d.title}</p>
                      <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
                        {item.quantity} × {d.unitPrice} ₽
                      </p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{d.lineTotal} ₽</p>
                  </div>
                )
              })}
            </div>

            <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Итого: {order.final_amount} ₽
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default OrdersPage
