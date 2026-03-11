import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function formatPhoneDigits(digitsAfter7: string): string {
  const rest = digitsAfter7.slice(0, 10)
  const a = rest.slice(0, 3)
  const b = rest.slice(3, 6)
  const c = rest.slice(6, 8)
  const d = rest.slice(8, 10)
  const parts = ["+7", a, b, c, d].filter(Boolean)
  return parts.length > 1 ? parts.join(" ") : "+7 "
}

function LoginPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [nameError, setNameError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const digits = phone.replace(/\D/g, "")

    let isValid = true

    if (trimmedName.length < 1) {
      setNameError("Введите имя")
      isValid = false
    } else {
      setNameError("")
    }

    if (digits.length < 11) {
      setPhoneError("Введите корректный номер телефона")
      isValid = false
    } else {
      setPhoneError("")
    }

    if (!isValid) {
      return
    }

    console.log("Отправка номера:", phone)
    navigate("/code", { state: { name, phone } })
  }

  return (
    <main className="page-container">
      <section className="auth-card">
        <Link to="/" className="auth-back">
          ← Назад
        </Link>

        <h1 className="auth-title">Добро пожаловать!</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="auth-text">Введите имя</p>
          <input
            type="text"
            placeholder="Введите имя"
            className={`auth-input ${nameError ? "auth-input-error" : ""}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError("")
            }}
          />
          {nameError && <p className="auth-error">{nameError}</p>}

          <p className="auth-text">Введите номер телефона</p>
          <input
            type="tel"
            placeholder="+7 ___ ___ __ __"
            onFocus={() => {
              if (!phone) {
                setPhone("+7 ")
              }
            }}
            className={`auth-input ${phoneError ? "auth-input-error" : ""}`}
            value={phone}
            onChange={(e) => {
              const raw = e.target.value
              const digits = raw.replace(/\D/g, "")
              const rest = digits.startsWith("7") ? digits.slice(1) : digits
              setPhone(formatPhoneDigits(rest))
              setPhoneError("")
            }}
          />
          {phoneError && <p className="auth-error">{phoneError}</p>}

          <button type="submit" className="auth-button">
            Получить код
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage