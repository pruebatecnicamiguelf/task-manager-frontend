import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  hidePassword = true;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  signup() {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      this.authService.signup(username, email, password).subscribe({
        next: (response) => {
          this.snackbarService.show(
            'Registration successful!',
            'success'
          );
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          this.snackbarService.show(
            'Registration failed. Please try again.',
            'error'
          );
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
