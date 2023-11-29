import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;

  login(username: string, password: string): boolean {
    // Implement your actual authentication logic here
    // For simplicity, let's assume any non-empty username and password combination is valid
    this.isAuthenticated = username.trim() !== '' && password.trim() !== '';
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
