import { Injectable, signal } from '@angular/core';
import KeyCloak from 'keycloak-js'
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private keycloak = new KeyCloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
    });

    public profile = signal<any>({});
    async init() {
        const authenticated = await this.keycloak.init({
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        });
        if (authenticated) {
            this.profile.set(await this.keycloak.loadUserProfile());
        }
    }
    login() {
        return this.keycloak.login({
            redirectUri: window.location.origin + '/dashboard' // <--- Esto debería enviar a /dashboard
        });
    }
    logout() { return this.keycloak.logout({ redirectUri: window.location.origin }); }
    get token() { return this.keycloak.token; }
    get roles() { return this.keycloak.tokenParsed?.realm_access?.roles || []; }
    isLoggedIn() { return !!this.keycloak.token; }
}