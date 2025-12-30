import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthPasswordGuard implements CanActivate {
  private readonly logger = new Logger(AuthPasswordGuard.name)

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const { password } = request.body

    const GUARD_PASSWORD = this.config.get<string>('GUARD_PASSWORD')

    if (!password || password !== GUARD_PASSWORD) {
      this.logger.warn('Unauthorized access attempt with invalid password')
      throw new UnauthorizedException()
    }

    return true
  }
}
