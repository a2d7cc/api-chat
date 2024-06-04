import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { NewUserDTO } from './dtos/new-user.dto';
import * as bcrypt from 'bcrypt';
import { ExistingUserDTO } from './dtos/existin-user.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers() {
    return await this.userRepository.find();
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
    return this.userRepository.findOne({
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

    return { token: jwt };
  }

  getHello(): string {
    return 'Hello World!';
  }
}
