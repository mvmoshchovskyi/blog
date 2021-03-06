import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/user/user.module';
import { RolesGuard } from './guards/roles.quard';
import { JwtStrategy } from './guards/jwt-strategy';
import { JwtAuthGuard } from './guards/jwt-quard';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '100000s' }
      })
    })
  ],
  providers: [AuthService, RolesGuard, JwtStrategy, JwtAuthGuard],
  exports: [AuthService]
})
export class AuthModule { }
