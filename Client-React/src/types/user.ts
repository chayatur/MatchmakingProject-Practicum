// types/user.ts
export type User = {
  id: number
  email: string
  passwordHash?: string
  username?: string
  address?: string | null
  phone?: string | null
  createdAt?: string
  updatedAt?: string
}

// UserDTO type שמתאים לשרת
export type UserDTO = {
  ID: number
  Username: string
  Email: string
  Address: string
  Phone: string
}

export type Login = {
  email: string
  password: string
}

export type Response = {
  user: User
  token: string
}
