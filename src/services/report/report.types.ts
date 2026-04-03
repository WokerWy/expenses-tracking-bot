import { SelectItem } from '../session/session.types';

export type DbRow = {
  date: Date
  amount: number
  category: string
  account: string
  user: string
}

type AccountTotal = {
  account: string
  income: number
  expense: number
  total: number
}

export type AccountTotalByUser = {
  user: string
  accounts: AccountTotal[]
}

export type AccountsByUser = {
  user: string
  accounts: SelectItem[]
}

export type CategoryTotal = {
  total: number
  category: string
}
