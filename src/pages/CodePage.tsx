import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

function CodePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { name, phone } = (location.state as { name?: string; phone?: string }) || {}

  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState("")
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (!phone) {
      navigate("/login", { replace: true })
      return
    }
  }, [phone, navigate])

  useEffect(() => {
    if (seconds <= 0) return

    const timer = setTimeout(() => {
      setSeconds(seconds - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds])

  const handleResend = () => {
    setSeconds(30)
    setCode("")
    setCodeError("")
    console.log("Повторная отправка кода")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const digits = code.replace(/\D/g, "")
    if (digits.length < 4) {
      setCodeError("Введите корректный код")
      return
    }

    if (digits === "1234") {
      setCodeError("")
      if (name !== undefined) localStorage.setItem("name", name)
      if (phone !== undefined) localStorage.setItem("phone", phone)
      navigate("/profile")
      return
    }

    setCodeError("Неверный код")
  }

  if (!phone) {
    return null
  }

  return (
    <main className="page-container">
      <section className="auth-card">
        <Link to="/login" className="auth-back">
          ← Назад
        </Link>

        <h1 className="auth-title">Введите код из SMS</h1>

        <p className="auth-text">Код отправлен на номер {phone}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <p className="auth-text">Введите код подтверждения</p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Введите код"
            className={`auth-input ${codeError ? "auth-input-error" : ""}`}
            value={code}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 4)
              setCode(digits)
              setCodeError("")
            }}
            maxLength={4}
          />

          {codeError && <p className="auth-error">{codeError}</p>}

          <button type="submit" className="auth-button">
            Подтвердить
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          {seconds > 0 ? (
            <p className="auth-text" style={{ margin: 0 }}>
              Отправить код снова через {seconds} сек
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              style={{
                background: "none",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                padding: 0,
                fontSize: 14,
                textDecoration: "underline",
              }}
            >
              Отправить код снова
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default CodePage