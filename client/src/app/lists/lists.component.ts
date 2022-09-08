import { LikeParams } from './../_models/likeParams';
import { Pagination } from './../_models/pagination';
import { MembersService } from './../_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]>;

  likeParams: LikeParams = {
    predicate: 'liked',
    pageNumber: 1,
    pageSize: 5

  };

  pagination: Pagination;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes()
  }

  loadLikes() {
    this.memberService.getLikes(this.likeParams).subscribe(response => {
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.likeParams.pageNumber = event.page;
    this.loadLikes();
  }

}
