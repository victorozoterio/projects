import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  private readonly logger = new Logger(TokensService.name);
  private readonly cognito = awsConfig().cognito;
  private readonly userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;

  constructor(
    @InjectRepository(TokenEntity)
    private readonly repository: Repository<TokenEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateTokenDto) {
    this.logger.log('Starting create token process');

    const user = await this.userRepository.findOneBy({ uuid: dto.userUuid });
    if (!user) throw new NotFoundException('User does not exist.');

    const userWithToken = await this.repository.findOneBy({ userUuid: { uuid: dto.userUuid }, type: dto.type });
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

      this.logger.log('Token updated and email sent');
      return this.repository.save(userWithToken);
    }

    const createdToken = this.repository.create({ token, userUuid: user, expiresAt, type: dto.type });
    await sendEmail({
      from: 'no-reply@victorozoterio.site',
      to: user.email,
      subject: dto.type === TokenType.EMAIL_VERIFICATION ? 'Confirme seu e-mail' : 'Redefinição de senha',
      body: emailTokenTemplate(user.name, token, dto.type),
    });

    this.logger.log('Token created and email sent');
    return this.repository.save(createdToken);
  }

  private async validateAndReturnUserIfValidTokenExists(dto: ValidateTokenDto, type: TokenType) {
    this.logger.log('Starting token validation process');

    const user = await this.userRepository.findOneBy({ uuid: dto.userUuid });
    if (!user) throw new NotFoundException('User does not exist.');

    const userWithToken = await this.repository.findOneBy({ userUuid: { uuid: dto.userUuid }, type });
    if (!userWithToken) throw new NotFoundException('Token not found.');

    if (userWithToken.expiresAt && userWithToken?.expiresAt < new Date()) {
      throw new ConflictException('Token has expired.');
    }

    if (userWithToken.token !== dto.token) throw new ConflictException('Invalid token.');

    this.logger.log('Token validation successful');
    return user;
  }

  async validateEmailVerificationToken(dto: ValidateTokenDto) {
    this.logger.log('Starting email verification token validation');

    const user = await this.validateAndReturnUserIfValidTokenExists(dto, TokenType.EMAIL_VERIFICATION);
    this.userRepository.merge(user, { isVerified: true });
    await this.userRepository.save(user);

    await this.cognito.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: this.userPoolId,
        Username: user.email,
        UserAttributes: [{ Name: 'email_verified', Value: 'true' }],
      }),
    );

    this.logger.log('Email verified successfully');
    return { message: 'Email verified successfully.' };
  }

  async validatePasswordResetToken(dto: ValidateTokenDto) {
    this.logger.log('Starting password reset token validation');

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

    this.logger.log('Password reset successfully');
    return { message: 'Password reset successfully.' };
  }
}
