import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getClients();
  }
  users: Array<any> = [];
  loading = true

  getClients(): void {
    this.userService.getUsers()
      .subscribe(result => {
        this.users = result.payload
        this.loading = false;
      });
  }

  clear(table: Table) {
    table.clear();
  }
}
