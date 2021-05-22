import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CorpusService} from "../service/corpus.service";
import {Corpus} from "../model/corpus";
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

  selectedIntent: any
  selectedUtterance: any
  selectedAnswer: any
  submitted: boolean = false;
  statuses!: any[];
  source: any

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
    this.corpus.data[this.intent].utterances.push({phrase: ''})
    this.setSource(this.intent)

  }

  deleteUtterance(utterance: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.corpus.data[this.intent].utterances.splice(utterance.id, 1)
        this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'Record deleted'});
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
            break;
        }
      }
    });
  }


  onItemSelected(selection: any) {
    this.messageService.add({severity: 'info', summary: 'Selected Row', detail: JSON.stringify(selection.data)});
    //console.log(this.selectedUtterance)
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
        this.corpus.data.splice(this.intent, 1)
        this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'Record deleted'});
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
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

  clonedProducts: { [s: string]: any } = {};

  onRowEditInit(product: any) {
    this.clonedProducts[product.id] = {...product};
  }

  onRowEditSave(product: any) {

    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Utterance is updated'});

  }

  onRowEditCancel(product: any, index: number) {
    this.corpus.data[this.intent].utterances[index] = this.clonedProducts[product.id];
    delete this.clonedProducts[product.id];
  }
}
