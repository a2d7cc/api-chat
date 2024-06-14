import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NewUserDTO } from './dtos/new-user.dto';
import * as bcrypt from 'bcrypt';
import { ExistingUserDTO } from './dtos/existin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@app/shared/entities/user.entity';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { UserRepositoryInterface } from '@app/shared';
import { UserJwt } from '@app/shared/interfaces/user-jwt.interface';
import { FriendRequestRepository } from '@app/shared/repositories/friend-request.repository';
import { FriendRequestEntity } from '@app/shared/entities/friend-request.entity';
@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    // @InjectRepository(UserEntity)
    // private readonly userRepository: Repository<UserEntity>,
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('FriendRequestRepositoryInterface')
    private readonly friendRequestRepository: FriendRequestRepository,
    private readonly jwtService: JwtService,
  ) {}
  async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneById(id);
  }
  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneById(id);
  }

  async getUsers() {
    return await this.userRepository.findAll();
  }

  async postUser() {
    return await this.userRepository.save({
      firstName: 'Larry',
      lastName: 'Jack',
      password: '123',
      email: 'larry.jack@gmail.com',
    });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const hashPassword = await bcrypt.hash(password, 8);
      return hashPassword;
    } catch (error) {
      console.log('error', error);
    }
  }

  async doesPasswordMatch(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    const doesUserExist = !!user;
    if (!doesUserExist) return null;
    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return user;
  }

  async register(newUser: Readonly<NewUserDTO>): Promise<UserEntity> {
    const { email, password, firstName, lastName } = newUser;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException('An account with that email already exist!');
    }

    const passwordHash = await this.hashPassword(password);

    const savedUser = await this.userRepository.save({
      email,
      password: passwordHash,
      firstName,
      lastName,
    });

    delete savedUser.password;

    return savedUser;
  }

  async login(existingUser: Readonly<ExistingUserDTO>) {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt, user };
  }

  async addFriend(
    userId: number,
    friendId: number,
  ): Promise<FriendRequestEntity> {
    const creator = await this.userRepository.findOneById(userId);
    const receiver = await this.userRepository.findOneById(friendId);

    return await this.friendRequestRepository.save({ creator, receiver });
  }

  async getFriends(userId: number): Promise<FriendRequestEntity[]> {
    const creator = await this.userRepository.findOneById(userId);

    return await this.friendRequestRepository.findWithRelations({
      where: [{ creator }, { receiver: creator }],
      relations: ['creator', 'receiver'],
    });
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException();
    }

    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) {
      return;
    }

    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
