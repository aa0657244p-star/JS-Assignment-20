import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsOptional()
  @IsArray()
  participants?: string[];

  @IsOptional()
  @IsString()
  groupName?: string;

  @IsOptional()
  @IsString()
  participantId?: string;
}