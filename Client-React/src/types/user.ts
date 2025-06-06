// Updated User type to match server structure
export type User = {
  id: number
  email: string
  passwordHash?: string // This should never be sent in updates
  username?: string
  address?: string | null
  phone?: string | null
  createdAt?: string
  updatedAt?: string
}

// Login request type
export type Login = {
  email: string
  password: string
}

// Response type for login/register
export type Response = {
  user: User
  token: string
  message?: string
}

// User registration type
export type UserRegistration = {
  username: string
  email: string
  passwordHash: string // Only used for registration
  phone?: string
  address?: string
}

// Profile update type - excludes password fields completely
export type UserProfileUpdate = {
  id: number
  username: string
  email: string
  phone?: string | null
  address?: string | null
}