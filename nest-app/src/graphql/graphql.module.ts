import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { UserResolver } from './user.resolver';
import { UserModule } from '../modules/user/user.module';
import { GraphqlAuthGuard } from '../common/guards/graphql-auth.guard';
import { GraphqlCacheInterceptor } from '../common/interceptors/graphql-cache.interceptor';
import { RedisModule } from '../modules/redis/redis.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: any }) => ({ req }),
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySuperSecretKey123',
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
    RedisModule,
  ],
  providers: [UserResolver, GraphqlAuthGuard, GraphqlCacheInterceptor],
})
export class GraphqlModule {}
