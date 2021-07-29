import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Table } from '../../../model/table';
import { TableService } from '../../../service/table.service';

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})
export class TableDetailComponent implements OnInit {

  constructor(private tableService: TableService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  table: Table = {
    tableId: '',
    tableSeats: 0,
    tableOccupied: false,
    area: ''
  };

  tableId = ''
  areas: [{}] = [{}]
    
  formMode = 'update'

  tableForm = this.fb.group({
    tableId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    tableSeats: new FormControl(''),
    tableOccupied: new FormControl(''),
    area: new FormControl(''),
  });


  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.tableId = params.tableId;
      });
    if (this.tableId) {
      this.getTable(this.tableId);
    } else {
      this.formMode = 'new'
    }

    this.tableForm.valueChanges.subscribe(res => {
      this.table = res
    })

  }

  getTable(Id: string) {
    this.tableService.getTableById(Id).subscribe(
      result => {
        this.table = result.payload[0]

        this.areas.push(this.table.area)
        console.log(this.table);


        this.tableForm.patchValue({
          tableId: this.table.tableId,
          tableSeats: this.table.tableSeats,
          tableOccupied: this.table.tableOccupied,
          area: this.table.area._id
        })
      }
    )
  }



  onSubmit() {
    if (this.tableForm.status === 'VALID') {
      (this.formMode === 'update') ? this.updateTable() : this.addTable();
    } else {
      let controls = ''
      for (let control in this.tableForm.controls) {
        if (this.tableForm.controls[control].status === 'INVALID') {
          controls = controls + control + ', '
        }
      }
      alert(`Make sure all the required fields are properly set: ${controls}`);
    }
  }

  updateTable() {
    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        //this.table.tableId = this.tableId
        this.tableService.updateTable(this.table).subscribe(result => {
          (result.status === 'success') ?
            this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'Table updated!' }) :
            this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: `Reason: ${result.payload}` })
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  addTable() {
    this.confirmationService.confirm({
      message: 'Do you want to add this record?',
      header: 'Add Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.tableService.addTable(this.table).subscribe(result => {
          (result.status === 'success') ?
            this.messageService.add({ severity: 'info', summary: 'Add Success', detail: 'Table Add!' }) :
            this.messageService.add({ severity: 'error', summary: 'Add Failed', detail: `Reason: ${result.payload}` })
        });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

}