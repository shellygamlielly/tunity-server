import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    console.log('token', token);
    console.log('auth', authHeader);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const spotifyProfileResponse = await fetch(
        'https://api.spotify.com/v1/me',
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!spotifyProfileResponse.ok) {
        throw new UnauthorizedException(
          'Illegal token - no user with this token.',
        );
      }
      const spotifyProfileData = await spotifyProfileResponse.json();
      const spotifyUserId = spotifyProfileData.id;

      req.userId = (
        await this.userService.getUserBySpotifyId(spotifyUserId)
      ).userId;

      return handler.handle();
    } catch (error) {
      console.error('Error in AuthInterceptor:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
