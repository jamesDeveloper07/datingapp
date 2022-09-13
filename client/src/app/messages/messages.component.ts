import { MessageService } from './../_services/message.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { MessageParams } from '../_models/messageParams';
import { Pagination } from '../_models/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  messageParams: MessageParams = {
    container: 'Unread',
    pageNumber: 1,
    pageSize: 5
  };
  loading = false;

  pagination: Pagination;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.messageParams).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
    });
  }

  pageChanged(event: any) {
    if (this.messageParams.pageNumber !== event.page) {
      this.messageParams.pageNumber = event.page;
      this.loadMessages();
    }
  }

}
