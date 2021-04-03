import { Controller, Get, Post, Delete, Put, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service'
import { User, UserRole } from '../models/user.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.quard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-quard';
import { userInfo } from 'node:os';

@Controller('users')
export class UserController {

  constructor(private userService: UserService) { }

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      })
    )
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id:string, @Body() user:User ): Observable<User>{
    return this.userService.updateRoleOfUser(Number(id), user)
  }
}


