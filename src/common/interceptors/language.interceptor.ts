import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'

import { Observable } from 'rxjs'

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    request.lang = request.headers['x-language'] || 'ua'
    return next.handle()
  }
}
