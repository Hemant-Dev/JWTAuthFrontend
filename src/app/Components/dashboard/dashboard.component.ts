import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  Users: any = [];
  role!: string;
  fullName: string = '';
  constructor(
    private auth: AuthService,
    private toast: NgToastService,
    private api: ApiService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    // debugger;
    this.api.getUsers().subscribe((res) => (this.Users = res));
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
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
