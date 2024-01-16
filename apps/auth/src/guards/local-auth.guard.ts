import { AuthGuard } from '@nestjs/passport';

export class LocalAuthGuard extends AuthGuard('local') {}
//passport => AuthGuard accepts multiple strategies: one of them is local and the other is jwt
