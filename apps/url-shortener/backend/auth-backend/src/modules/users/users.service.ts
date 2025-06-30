import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { awsConfig } from '../../config';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { TokensService } from '../tokens/tokens.service';
import { TokenType } from '../../utils';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';

@Injectable()
export class UsersService {
  private readonly cognito = awsConfig().cognito;
  private readonly userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;

  constructor(
    private readonly tokensService: TokensService,
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const cognitoUser = await this.cognito.send(
        new AdminCreateUserCommand({
          Username: dto.email,
          MessageAction: 'SUPPRESS',
          TemporaryPassword: dto.password,
          UserPoolId: this.userPoolId,
          UserAttributes: [
            { Name: 'email', Value: dto.email },
            { Name: 'name', Value: dto.name },
          ],
        }),
      );

      await this.cognito.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: this.userPoolId,
          Username: dto.email,
          Password: dto.password,
          Permanent: true,
        }),
      );

      const user = this.repository.create({
        uuid: cognitoUser.User?.Username,
        name: dto.name,
        email: dto.email,
      });

      await this.repository.save(user);
      await this.tokensService.create({ userUuid: user.uuid, type: TokenType.EMAIL_VERIFICATION });
      return user;
    } catch (err) {
      if (err.name === 'UsernameExistsException') {
        throw new ConflictException('User already exists.');
      }

      if (err.name === 'InvalidPasswordException') {
        throw new NotFoundException('Invalid password.');
      }

      throw new NotFoundException('Error creating user.');
    }
  }

  async signIn(dto: SignInUserDto) {
    const user = await this.repository.findOneBy({ email: dto.email });
    if (!user) throw new NotFoundException('User does not exist.');
    if (!user.isVerified) throw new UnauthorizedException('User not verified.');

    try {
      const response = await this.cognito.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.AWS_COGNITO_CLIENT_ID,
          AuthParameters: {
            USERNAME: dto.email,
            PASSWORD: dto.password,
          },
        }),
      );

      return {
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        expiresIn: response.AuthenticationResult?.ExpiresIn,
        tokenType: response.AuthenticationResult?.TokenType,
      };
    } catch (_err) {
      throw new NotFoundException('Invalid email or password.');
    }
  }

  async resetPassword(dto: ResetPasswordUserDto) {
    const user = await this.repository.findOneBy({ email: dto.email });
    if (!user) throw new NotFoundException('User does not exist.');
    await this.tokensService.create({ userUuid: user.uuid, type: TokenType.PASSWORD_RESET });
    return { message: 'Password reset token created. Please check your email.' };
  }
}
