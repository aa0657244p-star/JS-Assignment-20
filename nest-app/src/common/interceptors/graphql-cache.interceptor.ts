import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../../modules/redis/redis.service';

@Injectable()
export class GraphqlCacheInterceptor implements NestInterceptor {
  constructor(private redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    const key = `gql:${info.fieldName}`;

    const cached = await this.redisService.get(key);
    if (cached) {
      return of(JSON.parse(cached));
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.redisService.set(key, JSON.stringify(data), 60);
      }),
    );
  }
}