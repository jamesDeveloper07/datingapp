import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getUserWithRoles() {
    var url = this.baseUrl + 'admin/users-with-roles';
    return this.http.get<Partial<User[]>>(url);
  }

  updateUserRoles(username: string, roles: string[]) {
    var url = this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles;
    return this.http.post(url, {})
  }

}
