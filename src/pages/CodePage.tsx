import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function CodePage() {
const [code, setCode] = useState("")
const [seconds, setSeconds] = useState(30)

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
console.log("Повторная отправка кода")
}

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault()
console.log("Введенный код:", code)
}

return (
<main className="page-container">
<section className="auth-card">
<Link to="/login" className="auth-back">
← Назад
</Link>

    <h1 className="auth-title">
      Введите код
    </h1>

    <p className="auth-text">
      Код отправлен на ваш телефон
    </p>

    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Введите код"
        className="auth-input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={4}
      />

      <button type="submit" className="auth-button">
        Подтвердить
      </button>
    </form>

    {seconds > 0 ? (
      <p className="auth-text">
        Повторная отправка через {seconds} сек
      </p>
    ) : (
      <button type="button" className="auth-button" onClick={handleResend}>
        Отправить код снова
      </button>
    )}
  </section>
</main>

)
}

export default CodePage