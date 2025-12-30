import { Session } from 'express-session'
import { AuthenticatedRequest } from 'src/modules/user/types/auth-request.types'

import { LANG } from '../enums/translation.enum'

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
