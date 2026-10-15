import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { GraphqlAuthGuard } from '../common/guards/graphql-auth.guard';
import { GraphqlCacheInterceptor } from '../common/interceptors/graphql-cache.interceptor';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => String)
  hello(): string {
    return 'Hello from GraphQL!';
  }

  @Query(() => String)
  @UseGuards(GraphqlAuthGuard)
  @UseInterceptors(GraphqlCacheInterceptor)
  async getUser(@Args('id') id: string): Promise<string> {
    const user = await this.userService.findById(id);
    return JSON.stringify(user);
  }
}