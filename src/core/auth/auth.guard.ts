import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Request } from 'express'
import { AuthenticatedRequest } from 'src/modules/user/types/auth-request.types'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name)

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    if (!token) throw new UnauthorizedException('NOT_AUTHORIZED')

    try {
      const payload = await this.jwtService.verifyAsync<AuthenticatedRequest>(token, {
        secret: process.env.JWT_SECRET as string,
      })
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('NOT_AUTHORIZED')
    }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
