import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Table} from 'primeng/table';
import {TableService} from '../../../service/table.service';
import {AreaService} from "../../../service/area.service";

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  constructor(private areaService: AreaService, private tableService: TableService, private _router: Router, private route: ActivatedRoute) {
  }

  loading: boolean = true;

  async ngOnInit() {
   await this.getAreas()
   await this.getTables()
  }

  tables: Array<any> = [];
  areas?: any

 async getTables() {
    this.tableService.getAllTables()
      .subscribe(result => {
        this.tables = result.payload
        if (Array.isArray(this.tables)) {
          for (let table of this.tables) {
            table.areaName = this.getAreaName(table.areaId)
          }
        }
        this.loading = false;
      });
  }

 async getAreas() {
    this.areaService.getAreas().subscribe(
      result => {
        this.areas = result.payload
      }
    )
  }

  clear(table: Table) {
    table.clear();
  }

  getAreaName(id: any) {
    let area = this.areas.find((area: any) => area.areaId === id);
    if (area) return area.areaName
    return null;
  }
}
