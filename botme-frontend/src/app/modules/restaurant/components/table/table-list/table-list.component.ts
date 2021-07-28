import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { TableService } from '../../../service/table.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  constructor(private tableService: TableService, private _router: Router, private route: ActivatedRoute) { }

  loading: boolean = true;

  ngOnInit(): void {
    this.getTables();
  }

  tables: Array<any> = [];


  getTables(): void {
    this.tableService.getAllTables()
      .subscribe(result => {
        this.tables = result.payload
        this.loading = false;
      });
  }

  clear(table: Table) {
    table.clear();
}

}
