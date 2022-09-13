import { MessageParams } from './../_models/messageParams';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { getPaginationHeaders, getPaginationResult } from './paginationHelper';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  messageParams: MessageParams;


  constructor(private http: HttpClient, private accountService: AccountService) {

  }

  getMessages(messageParams: MessageParams) {
    let params = getPaginationHeaders(messageParams.pageNumber, messageParams.pageSize);
    params = params.append('Container', messageParams.container);
    var url = this.baseUrl + 'messages';
    return getPaginationResult<Message[]>(url, params, this.http);
  }

  getMessageThread(username: string) {
    var url = this.baseUrl + 'messages/thread/' + username;
    return this.http.get<Message[]>(url);
  }

  sendMessage(username: string, content: string) {
    var url = this.baseUrl + 'messages';
    var message = { recipientUsername: username, content }
    return this.http.post<Message>(url, message);
  }

  deleteMessage(id: number) {
    var url = this.baseUrl + 'messages/' + id;
    return this.http.delete(url);
  }
}
