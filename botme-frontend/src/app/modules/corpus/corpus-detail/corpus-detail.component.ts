import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CorpusService} from "../service/corpus.service";
import {Corpus} from "../model/corpus";
import {
  GuiColumn,
  GuiColumnAlign,
  GuiGridComponent,
  GuiPaging,
  GuiPagingDisplay,
  GuiRowColoring
} from "@generic-ui/ngx-grid";
import {ConfirmationService, ConfirmEventType, MessageService} from "primeng/api";

@Component({
  selector: 'app-corpus-detail',
  templateUrl: './corpus-detail.component.html',
  styleUrls: ['./corpus-detail.component.css']
})
export class CorpusDetailComponent implements OnInit {

  constructor(private corpusService: CorpusService,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private confirmationService: ConfirmationService
  ) {
  }

  @ViewChild('utterance', {static: true})
  gridComponent: GuiGridComponent | any
  selectedIntent: any
  submitted: boolean = false;
  statuses!: any[];


  corpusId = ''
  formMode = 'update'
  formEdited = false
  intent = 0
  corpus: Corpus
    = {
    corpusId: '',
    active: true,
    comment: '',
    name: '',
    locale: '',
    data: [{
      intent: '',
      utterances: [],
      answers: [{
        answer: '',
        opts: ''
      }]
    }],
    contextData: {}
  }

  columns: Array<GuiColumn> = [{
    header: '#',
    field: 'id',
    width: 40,
    align: GuiColumnAlign.CENTER
  }, {
    header: 'Phrases',
    field: 'phrase'
  }];
  source: Array<any> = []
  rowColoring: GuiRowColoring = GuiRowColoring.ODD

  horizontalGrid: boolean = true
  verticalGrid: boolean = true
  gridLoading: boolean = true
  paging: GuiPaging = {
    enabled: true,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 25, 50],
    pagerTop: false,
    pagerBottom: true,
    display: GuiPagingDisplay.ADVANCED
  }
  selectedRow: number = 0


  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.corpusId = params.corpusId;
      });

    if (!this.corpusId) {
      this.formMode = 'new'
    } else {
      this.getCorpusDetails(this.corpusId)
    }

    this.statuses = [
      {label: 'INSTOCK', value: 'instock'},
      {label: 'LOWSTOCK', value: 'lowstock'},
      {label: 'OUTOFSTOCK', value: 'outofstock'}
    ];

  }

  onSubmit(): void {
    console.log('source edited')
  }

  getCorpusDetails(corpusId: string): void {
    this.corpusService.getCorpusDetail(corpusId)
      .subscribe(result => {
        this.corpus = result.payload.corpus
        this.setIntent(0)
        this.gridLoading = false
      })
  }

  setIntent(intent: number) {
    this.intent = intent
    this.setSource(intent)
  }


  setSource(intent: number) {
    this.source = this.getUtterances(intent)
  }

  getUtterances(intent: number): any {
    for (let i in this.corpus.data[intent].utterances) {
      this.corpus.data[intent].utterances[i] = {id: i, phrase: this.corpus.data[intent].utterances[i].phrase}
    }
    return this.corpus.data[intent].utterances
  }

  setformEdited(status: boolean) {
    this.formEdited = status
    if (status) {
      console.log('Form Editing start')
    } else {
      console.log('Form editing finished')
    }
  }

  addNewUtterance() {
    this.gridLoading = true
    this.corpus.data[this.intent].utterances.push({phrase: ''})
    this.setSource(this.intent)
    this.gridLoading = false
  }


  onItemSelected(phrases: Array<any>) {
    this.selectedRow = phrases[0].id
    this.messageService.add({severity: 'info', summary: 'Selected Row', detail: this.selectedRow.toString()});
  }

  addNewIntent(val: string) {
    this.corpus.data.push({
      intent: val,
      utterances: [],
      answers: [{
        answer: '',
        opts: ''
      }]
    })
  }

  deleteIntent() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({severity:'info', summary:'Confirmed', detail:'Record deleted'});
        this.corpus.data.splice(this.intent,1)
      },
      reject: (type: any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
            break;
        }
      }
    });

  }

  onRowSelect(event: any) {
    this.messageService.add({severity: 'info', summary: 'Intent Selected', detail: event.data});
    for (let i = 0; i < this.corpus.data.length; i++) {
      if (event.data === this.corpus.data[i].intent)
      this.setIntent(i)
    }
  }

  onRowUnselect(event: any) {
    this.messageService.add({severity: 'info', summary: 'Product Unselected', detail: event.data});
  }

}
