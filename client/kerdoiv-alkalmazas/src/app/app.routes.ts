import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', loadComponent: () => import('./register/register.component').then((c) => c.RegisterComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'logout', loadComponent: () => import('./logout/logout.component').then((c) => c.LogoutComponent) },
    { path: 'kerdoivek', loadComponent: () => import('./nyilvanos-kerdoivek/nyilvanos-kerdoivek.component').then((c) => c.NyilvanosKerdoivekComponent) },
    { path: 'szerkesztes', loadComponent: () => import('./kerdoiv-szerkesztes/kerdoiv-szerkesztes.component').then((c) => c.KerdoivSzerkesztesComponent) },
    { path: '**', redirectTo: 'login' }
];
