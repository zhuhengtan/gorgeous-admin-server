import { randomUUID } from 'crypto'
import md5 from 'md5'

export const hash = (pwd: string): string => {
  const salt = randomUUID()
  return `${salt}$${md5(salt + pwd)}`
}

export const verify = (pwdLocal: string, pwdToCheck: string): boolean => {
  const t = pwdLocal.split('$')
  return t[1] === md5(t[1] + pwdToCheck)
}
