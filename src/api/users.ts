const STORAGE_NAME = "name"
const STORAGE_PHONE = "phone"
const STORAGE_EMAIL = "email"

const API_BASE = import.meta.env.VITE_API_URL ?? ""

export type UserProfile = {
  name: string
  email: string
}

export type UserMe = {
  id: number
  phone: string
  profile: UserProfile
}

export async function getUsersMe(): Promise<UserMe | null> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/users/me`)
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }

  const name = localStorage.getItem(STORAGE_NAME)
  const phone = localStorage.getItem(STORAGE_PHONE)
  const email = localStorage.getItem(STORAGE_EMAIL) ?? ""

  if (!name || !phone) return null

  return {
    id: 1,
    phone,
    profile: { name, email },
  }
}

export async function patchUsersMe(data: { name?: string; phone?: string; email: string }): Promise<UserMe> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to update profile")
    return res.json()
  }

  const currentName = localStorage.getItem(STORAGE_NAME) ?? ""
  const currentPhone = localStorage.getItem(STORAGE_PHONE) ?? ""

  const name = data.name ?? currentName
  const phone = data.phone ?? currentPhone
  const email = data.email

  if (data.name != null) localStorage.setItem(STORAGE_NAME, name)
  if (data.phone != null) localStorage.setItem(STORAGE_PHONE, phone)
  localStorage.setItem(STORAGE_EMAIL, email)

  return {
    id: 1,
    phone,
    profile: { name, email },
  }
}
