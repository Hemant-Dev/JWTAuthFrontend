import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/Helpers/validateform';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  hideShowPassword() {
    this.isText = !this.isText;
    this.isText
      ? (this.eyeIcon = 'fa fa-eye')
      : (this.eyeIcon = 'fa fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.toast.success({
            detail: 'Success',
            summary: res.message,
            duration: 3000,
          });

          this.auth.storeToken(res.token);
          this.loginForm.reset();
          this.router.navigate(['dashboard']);
        },
        error: (err) =>
          this.toast.error({
            detail: 'Error',
            summary: err.error.message,
            duration: 3000,
          }),
      });
    } else {
      console.log('Form is invalid');
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}
