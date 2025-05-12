import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { TokenEntity } from './entities/token.entity';
import { emailTokenTemplate, generateRandomCode } from './utils';
import { sendEmail, TokenType } from '../../utils';
import { awsConfig } from '../../config';
import {
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class TokensService {
  private readonly cognito = awsConfig().cognito;
  private readonly userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;

  constructor(
    @InjectRepository(TokenEntity)
    private readonly repository: Repository<TokenEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateTokenDto) {
    const user = await this.userRepository.findOneBy({ uuid: dto.userUuid });
    if (!user) throw new NotFoundException('User does not exist.');

    const userWithToken = await this.repository.findOneBy({ userUuid: { uuid: dto.userUuid }, type: dto.type });
    if (userWithToken?.expiresAt && userWithToken?.expiresAt > new Date()) {
      throw new ConflictException('User already has a valid token.');
    }

    const token = generateRandomCode(6);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    if (userWithToken) {
      this.repository.merge(userWithToken, { token, expiresAt });
      await sendEmail({
        from: 'no-reply@victorozoterio.site',
        to: user.email,
        subject: dto.type === TokenType.EMAIL_VERIFICATION ? 'Confirme seu e-mail' : 'Redefinição de senha',
        body: emailTokenTemplate(user.name, token, dto.type),
      });
      return this.repository.save(userWithToken);
    }

    const createdToken = this.repository.create({ token, userUuid: user, expiresAt, type: dto.type });
    await sendEmail({
      from: 'no-reply@victorozoterio.site',
      to: user.email,
      subject: dto.type === TokenType.EMAIL_VERIFICATION ? 'Confirme seu e-mail' : 'Redefinição de senha',
      body: emailTokenTemplate(user.name, token, dto.type),
    });

    return this.repository.save(createdToken);
  }

  private async validateAndReturnUserIfValidTokenExists(dto: ValidateTokenDto, type: TokenType) {
    const user = await this.userRepository.findOneBy({ uuid: dto.userUuid });
    if (!user) throw new NotFoundException('User does not exist.');

    const userWithToken = await this.repository.findOneBy({ userUuid: { uuid: dto.userUuid }, type });
    if (!userWithToken) throw new NotFoundException('Token not found.');

    if (userWithToken.expiresAt && userWithToken?.expiresAt < new Date()) {
      throw new ConflictException('Token has expired.');
    }

    if (userWithToken.token !== dto.token) throw new ConflictException('Invalid token.');
    return user;
  }

  async validateEmailVerificationToken(dto: ValidateTokenDto) {
    const user = await this.validateAndReturnUserIfValidTokenExists(dto, TokenType.EMAIL_VERIFICATION);
    this.userRepository.merge(user, { isVerified: true });
    this.userRepository.save(user);

    await this.cognito.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: this.userPoolId,
        Username: user.email,
        UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
      }),
    );

    return { message: 'Email verified successfully.' };
  }

  async validatePasswordResetToken(dto: ValidateTokenDto) {
    if (!dto.password) throw new ConflictException('Password is required.');

    const user = await this.validateAndReturnUserIfValidTokenExists(dto, TokenType.PASSWORD_RESET);
    await this.cognito.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: this.userPoolId,
        Username: user.email,
        Password: dto.password,
        Permanent: true,
      }),
    );

    return { message: 'Password reset successfully.' };
  }
}
