import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmPasswordValidator } from 'src/app/Helpers/confirm-password.validator';
import ValidateForm from 'src/app/Helpers/validateform';
import { ResetPassword } from 'src/app/Models/reset-password';
import { ResetPasswordService } from 'src/app/Services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resetService: ResetPasswordService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );

    this.activatedRoute.queryParams.subscribe((val) => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];

      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToReset);
      console.log(this.emailToken);
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword =
        this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetService.resetPassword(this.resetPasswordObj).subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Password Reset Successfull.',
            duration: 3000,
          });
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'Error',
            summary: err.errors,
            duration: 3000,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
