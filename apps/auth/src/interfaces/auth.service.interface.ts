import { UserEntity } from '@app/shared/entities/user.entity';
import { NewUserDTO } from '../dtos/new-user.dto';
import { ExistingUserDTO } from '../dtos/existin-user.dto';
import { UserJwt } from '@app/shared/interfaces/user-jwt.interface';
import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';

export interface AuthServiceInterface {
  getUsers(): Promise<UserEntity[]>;
  getUserById(id: number): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity>;
  findById(id: number): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  register(newUser: Readonly<NewUserDTO>): Promise<UserEntity>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  validateUser(email: string, password: string): Promise<UserEntity>;
  login(existingUser: Readonly<ExistingUserDTO>): Promise<{
    token: string;
    user: UserEntity;
  }>;
  verifyJwt(jwt: string): Promise<{ exp: number }>;
  getUserFromHeader(jwt: string): Promise<UserJwt>;
  addFriend(userId: number, friendId: number): Promise<FriendRequestEntity>;
  getFriends(userId: number): Promise<FriendRequestEntity[]>;
}
