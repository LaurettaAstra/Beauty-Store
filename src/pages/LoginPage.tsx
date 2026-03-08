import { useState } from "react"
import { Link } from "react-router-dom"

function LoginPage() {
  const [phone, setPhone] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Отправка номера:", phone)
  }

  return (
    <main className="page-container">
      <section className="auth-card">

        <Link to="/" className="auth-back">
          ← Назад
        </Link>

        <h1 className="auth-title">
          Добро пожаловать!
        </h1>

        <p className="auth-text">
          Введите ваш номер телефона
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="+7 ___ ___ __ __"
            className="auth-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button type="submit" className="auth-button">
            Получить код
          </button>
        </form>

      </section>
    </main>
  )
}

export default LoginPage