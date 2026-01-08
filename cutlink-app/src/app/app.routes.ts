import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './auth/auth.guard';
import { LandingPage } from './pages/landing/landing';
import { RedirectPage } from './pages/redirect/redirect';
import { DashboardPage } from './pages/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: LandingPage },
    { path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
    //{ path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'r/:code', component: RedirectPage },
    { path: '**', redirectTo: '' }
];
