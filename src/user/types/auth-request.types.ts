import { Roles } from 'src/common/enums/user.enum'

export interface AuthenticatedRequest extends Request {
  user: { id: number; role: Roles }
}
