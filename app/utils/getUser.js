// app/utils/getUser.js

export async function getUser() {
  const res = await fetch('/api/auth/user')
  if (res.ok) {
    const data = await res.json()
    return data.user
  }
  return null
}
