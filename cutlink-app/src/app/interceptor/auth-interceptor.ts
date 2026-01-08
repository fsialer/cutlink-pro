import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  // No añadir token si es una URL excluida o si no hay token
  const excludedUrls = ['/assets', '/public'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (token && !isExcluded) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  return next(req);
};
