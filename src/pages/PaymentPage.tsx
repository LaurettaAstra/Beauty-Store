import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ORDERS_KEY, type Order, type OrderItem } from "./OrdersPage"
import { getUsersMe, patchUsersMe } from "../api/users"

export type PaymentMethodId = "bank_card" | "sbp"

const PAYMENT_METHODS: { id: PaymentMethodId; label: string; description: string }[] = [
  { id: "bank_card", label: "Банковская карта", description: "Visa / Mastercard / Мир" },
  { id: "sbp", label: "СБП", description: "Быстрая оплата через банковское приложение" },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email.trim())
}

async function submitPayment(orderId: string, paymentMethod: PaymentMethodId): Promise<void> {
  const payload = { order_id: orderId, payment_method: paymentMethod }
  console.log("POST /payment", payload)
}

function getItemDisplay(item: OrderItem & { title?: string; image?: string; price?: number }) {
  const unitPrice = item.unit_price ?? item.price ?? 0
  const lineTotal = item.line_total ?? (item.price != null ? item.price * item.quantity : unitPrice * item.quantity)
  const oldPrice = item.old_price
  const isDiscounted = oldPrice != null && oldPrice > unitPrice
  const discountAmount = isDiscounted ? (oldPrice - unitPrice) * item.quantity : 0
  return {
    title: item.title_snapshot ?? item.title ?? "",
    image: item.image_snapshot ?? item.image ?? "",
    unitPrice,
    lineTotal,
    isDiscounted,
    oldLineTotal: isDiscounted ? oldPrice * item.quantity : 0,
    discountAmount,
  }
}

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
}

function PaymentPage() {
  const { orderId } = useParams<"orderId">()
  const navigate = useNavigate()
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>("bank_card")
  const [name, setName] = useState<string | null>(null)
  const [phone, setPhone] = useState<string | null>(null)
  const [profileEmail, setProfileEmail] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string | null>(null)

  const order: Order | null = (() => {
    if (!orderId) return null
    try {
      const orders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]")
      return orders.find((o) => o.order_id === orderId) ?? null
    } catch {
      return null
    }
  })()

  useEffect(() => {
    getUsersMe().then((user) => {
      if (user) {
        setName(user.profile.name)
        setPhone(user.phone)
        const profileEmailVal = user.profile.email ?? ""
        setProfileEmail(profileEmailVal)
        setEmail((prev) => (prev === "" ? profileEmailVal : prev))
      }
    })
  }, [])

  const handlePay = async () => {
    if (!order) return

    setEmailError(null)
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setEmailError("Введите e-mail")
      return
    }

    if (!isValidEmailFormat(trimmedEmail)) {
      setEmailError("Введите корректный e-mail")
      return
    }

    try {
      await submitPayment(order.order_id, selectedMethod)

      if (trimmedEmail !== profileEmail) {
        await patchUsersMe({ email: trimmedEmail })
      }

      navigate("/orders")
    } catch {
      return
    }
  }

  if (!order) {
    return (
      <main className="page-container">
        <Link to="/cart" className="back-link" style={{ display: "inline-block", marginBottom: 16 }}>
          ← Назад
        </Link>
        <h1 className="catalog-title">Оформление заказа</h1>
        <p style={{ color: "#6b7280", fontSize: 15 }}>
          Заказ не найден.{" "}
          <Link to="/orders" style={{ color: "#111827", textDecoration: "underline" }}>
            Мои заказы
          </Link>
        </p>
      </main>
    )
  }

  return (
    <main className="page-container">
      <Link to="/cart" className="back-link" style={{ display: "inline-block", marginBottom: 16 }}>
        ← Назад
      </Link>
      <h1 className="catalog-title">Оформление заказа</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "start",
        }}
      >
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ ...cardStyle }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>Контактные данные</h2>
            {name && <p style={{ margin: "0 0 8px", fontSize: 15 }}>{name}</p>}
            {phone && <p style={{ margin: "0 0 16px", fontSize: 15, color: "#6b7280" }}>{phone}</p>}
            {!name && !phone && (
              <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280" }}>Данные не указаны</p>
            )}
            <label style={{ display: "block", marginBottom: 8, fontSize: 15, color: "#6b7280" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(null)
              }}
              placeholder="email@example.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: emailError ? "1px solid #ef4444" : "1px solid #e5e7eb",
                fontSize: 16,
                marginBottom: 4,
                boxSizing: "border-box",
              }}
            />
            {emailError && (
              <p style={{ margin: "0 0 16px", color: "#ef4444", fontSize: 14 }}>{emailError}</p>
            )}
          </div>

          <div style={{ ...cardStyle }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>Товары в заказе</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 12,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 15 }}>{d.title}</p>
                      <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
                        ({item.quantity} шт.)
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {d.isDiscounted ? (
                        <>
                          <p style={{ margin: "0 0 2px", fontSize: 13 }}>
                            <span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: 8 }}>{d.oldLineTotal} ₽</span>
                            <span style={{ color: "#dc2626", fontWeight: 600 }}>-{d.discountAmount} ₽</span>
                          </p>
                          <p style={{ margin: 0, fontWeight: 700 }}>{d.lineTotal} ₽</p>
                        </>
                      ) : (
                        <p style={{ margin: 0, fontWeight: 700 }}>{d.lineTotal} ₽</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ ...cardStyle }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>Способ оплаты</h2>
            {PAYMENT_METHODS.map((method, index) => (
              <label
                key={method.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 0",
                  cursor: "pointer",
                  borderBottom: index < PAYMENT_METHODS.length - 1 ? "1px solid #e5e7eb" : "none",
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => setSelectedMethod(method.id)}
                  style={{ marginTop: 4, accentColor: "#111827" }}
                />
                <div>
                  <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{method.label}</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>{method.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div style={{ ...cardStyle }}>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600 }}>Итоги</h2>
            <p style={{ margin: "0 0 8px", fontSize: 15, display: "flex", justifyContent: "space-between" }}>
              <span>Товары</span>
              <span>{order.total_amount ?? order.final_amount} ₽</span>
            </p>
            <p style={{ margin: "0 0 8px", fontSize: 15, display: "flex", justifyContent: "space-between" }}>
              <span>Скидка</span>
              <span style={{ color: (order.discount_amount ?? 0) > 0 ? "#dc2626" : "inherit" }}>
                {(order.discount_amount ?? 0) > 0 ? `-${order.discount_amount}` : order.discount_amount ?? 0} ₽
              </span>
            </p>
            <p style={{ margin: "16px 0 0", fontSize: 18, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
              <span>К оплате</span>
              <span>{order.final_amount} ₽</span>
            </p>
          </div>

          <button type="button" className="add-button" style={{ width: "100%" }} onClick={handlePay}>
            Оплатить
          </button>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage
