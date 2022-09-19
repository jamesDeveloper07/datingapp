import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Photo } from '../_models/photo';
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

  getPhotosForApproval() {
    var url = this.baseUrl + 'admin/photos-to-moderate'
    return this.http.get<Photo[]>(url);
  }

  approvePhoto(photoId: number) {
    var url = this.baseUrl + 'admin/approve-photo/' + photoId;
    return this.http.post(url, {});
  }

  rejectPhoto(photoId: number) {
    var url = this.baseUrl + 'admin/reject-photo/' + photoId;
    return this.http.post(url, {});
  }

}
