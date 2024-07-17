export type User = {
  id: string
  name: string
  phone: string
  email: string
  password: string
  timestamp: Date | string
}

export type Helper = {
  id: string
  image: string
  goal: string
  value: string
  category: string
  description: string
  user: { name: string; email: string }
  title: string
  userId: string
  timestamp: Date | string
}

export interface Token {
  iat?: string
  exp?: string
  id?: string
}
