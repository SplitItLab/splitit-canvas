// Types for SplitIt
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Participant {
  id: string
  name: string
  /** Cuenta vinculada al integrante. Vacio = invitado sin cuenta. */
  userId?: string
  email?: string
  avatar?: string
  isGuest: boolean
}

export interface Expense {
  id: string
  eventId: string
  name: string
  amount: number // stored in the event's currency
  paidBy: string // participant id
  splitBetween: string[] // participant ids
  date: string
  category?: ExpenseCategory
  createdAt: string
  originalAmount?: number // amount as entered, before conversion
  originalCurrency?: string // ISO currency of originalAmount, set only when it differs from the event currency
  exchangeRate?: number // amount === originalAmount * exchangeRate, snapshot at registration time
}

export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'other'

export interface Event {
  id: string
  name: string
  description?: string
  createdBy: string
  participants: Participant[]
  expenses: Expense[]
  createdAt: string
  inviteCode: string
  currency: string
  icon?: import('./event-icons').EventIcon
}

export interface Balance {
  participantId: string
  participantName: string
  totalPaid: number
  totalOwed: number
  netBalance: number // positive = owed money, negative = owes money
}

export interface Settlement {
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
  settled: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
