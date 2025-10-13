import { User } from 'src/user/entities/user.entity'
import { LANG } from '../enums/translation.enum'
import { Session } from 'express-session'
import { AuthenticatedRequest } from 'src/user/types/auth-request.types'

declare module 'express' {
  interface Request {
    lang: LANG
    session: Session & {
      products: number[]
      cart_id: number
    }
    user: AuthenticatedRequest
  }
}
