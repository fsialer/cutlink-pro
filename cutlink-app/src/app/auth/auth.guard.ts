import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);


    if (!authService.isLoggedIn()) {
        await authService.login();
        return false;
    }

    const requiredRoles = route.data['roles'] as string[];
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const hasRole = requiredRoles.some(role => authService.roles.includes(role));

    if (!hasRole) {
        router.navigate(['/unauthorized']);
        return false;
    }
    return true;
};
