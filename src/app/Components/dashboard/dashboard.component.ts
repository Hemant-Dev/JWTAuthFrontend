import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  Users: any = [];
  constructor(
    private auth: AuthService,
    private toast: NgToastService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe({
      next: (data) => {
        this.Users = data;
      },
      error: (err) => console.log(err),
    });
  }

  logout() {
    this.auth.signout();
    this.toast.success({
      detail: 'Success',
      summary: 'You have logged out successfully.',
      duration: 3000,
    });
  }
}
