import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new user in the system.' })
  @ApiResponse({ status: 201, description: 'Returns the user created.' })
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in a user in the system.' })
  @ApiResponse({ status: 201, description: 'Returns an access token.' })
  async login(@Body() dto: SignInUserDto) {
    return await this.usersService.signIn(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Sends a password reset token to a user in the system' })
  @ApiResponse({ status: 200, description: 'Returns a success message.' })
  async resetPassword(@Body() dto: ResetPasswordUserDto) {
    return await this.usersService.resetPassword(dto);
  }
}
