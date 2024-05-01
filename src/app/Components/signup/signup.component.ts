import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/Helpers/validateform';
import { Response } from 'src/app/Models/response';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';

  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
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

  onSubmit() {
    if (this.signupForm.valid) {
      // console.log(this.signupForm.value);
      this.auth.signUp(this.signupForm.value).subscribe({
        next: (res: any) => {
          // const response = res as Response;
          // alert(response.message);
          this.toast.success({
            detail: 'Success',
            summary: res.message,
            duration: 3000,
          });
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'Error',
            summary: err.message,
            duration: 3000,
          }),
            console.log(err);
        },
      });
    } else {
      console.log('Form is Invalid');
      ValidateForm.validateAllFormFields(this.signupForm);
    }
  }
}
