import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/Helpers/validateform';
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

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
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
        next: (res) => {
          alert(res);
          console.log(res);
        },
        error: (err) => alert(err),
      });
    } else {
      console.log('Form is Invalid');
      ValidateForm.validateAllFormFields(this.signupForm);
    }
  }
}
