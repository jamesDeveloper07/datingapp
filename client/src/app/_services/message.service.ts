import { BusyService } from './busy.service';
import { Group } from './../_models/group';
import { MessageParams } from './../_models/messageParams';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { getPaginationHeaders, getPaginationResult } from './paginationHelper';
import { map, take } from 'rxjs/operators';
import { Message } from '../_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  //messageParams: MessageParams;

  constructor(private http: HttpClient, private toastr: ToastrService, private busyService: BusyService) { }

  createHubConnection(user: User, otherUsername: string) {
    this.busyService.busy();
    var url = this.hubUrl + 'message?user=' + otherUsername;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .catch(error => console.log(error))
      .finally(() => this.busyService.idle());

    this.hubConnection.on('ReceiveMessageThread', message => {
      this.messageThreadSource.next(message);
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message]);
      })
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(c => c.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    })

  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.messageThreadSource.next([]);
      this.hubConnection.stop().catch(error => console.log(error));
    }
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

  async sendMessage(username: string, content: string) {
    var url = this.baseUrl + 'messages';
    var message = { recipientUsername: username, content }
    //return this.http.post<Message>(url, message);
    return this.hubConnection.invoke('SendMessage', message)
      .catch(error => console.log(error));
  }

  deleteMessage(id: number) {
    var url = this.baseUrl + 'messages/' + id;
    return this.http.delete(url);
  }
}
