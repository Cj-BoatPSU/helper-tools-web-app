import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.authService.login(this.username, this.password)) {
      // Redirect to home page after successful login
      // You may use Angular Router for navigation
      this.router.navigate(['/home']);
      console.log('Login successful!');
    } else {
      console.log('Invalid credentials');
    }
  }
}
