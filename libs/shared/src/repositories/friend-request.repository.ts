import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { FriendRequestEntity } from '../entities/friend-request.entity';
import { FriendRequestRepositoryInterface } from '../interfaces/friend-request.repository.interface';

@Injectable()
export class FriendRequestRepository
  extends BaseAbstractRepository<FriendRequestEntity>
  implements FriendRequestRepositoryInterface
{
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestEntity: Repository<FriendRequestEntity>,
  ) {
    super(friendRequestEntity);
  }
}
