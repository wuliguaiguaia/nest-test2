import { Logger } from '@nestjs/common';
import { ApiErrorCode } from './../../common/exceptions/api.code.enum';
import { ApiException } from './../../common/exceptions/api.exception';
import { LoginDto } from './../user/dto/user.dto';
import { UserService } from './../user/user.service';
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Post('login')
  async login(@Body() userDto: LoginDto, @Req() req) {
    const { mobile, password } = userDto;
    const users = await this.userService.getUserByMobile(mobile);
    if (users.length === 0) {
      throw new ApiException(ApiErrorCode.NOT_VALUABLE_USER_ID, '用户不存在');
    }
    const user = users[0];
    if (user.password !== password) {
      throw new ApiException(ApiErrorCode.TABLE_OPERATE_ERROR, '密码错误');
    } else {
      req.session.userInfo = user;
    }
  }

  @Get('logout')
  async logout(@Req() req, @Res() res) {
    req.session.destroy((err) => {
      if (err) {
        throw new ApiException(ApiErrorCode.SYSTEM_EXCEPTION_ERROR);
      }
      res.redirect('/');
    });
  }
}
