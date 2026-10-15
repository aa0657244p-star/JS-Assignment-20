import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
      RESP: 2,
    });
  }

  async onModuleInit() {
    this.client.on('error', (err: any) => {
      console.error('Redis Client Error:', err.message);
    });
    try {
      await this.client.connect();
      console.log('Redis connected successfully');
    } catch (error: any) {
      console.error('Redis connection error:', error.message);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch (e) {}
  }

  async addSocket(userId: string, socketId: string) {
    await this.client.sAdd(`user:sockets:${userId}`, socketId);
  }

  async removeSocket(userId: string, socketId: string) {
    await this.client.sRem(`user:sockets:${userId}`, socketId);
  }

  async getSockets(userId: string) {
    return await this.client.sMembers(`user:sockets:${userId}`);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) await this.client.setEx(key, ttl, value);
    else await this.client.set(key, value);
  }

  async get(key: string) {
    return await this.client.get(key);
  }
}