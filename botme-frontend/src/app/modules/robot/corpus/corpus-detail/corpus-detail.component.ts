import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { CorpusService } from "../service/corpus.service";
import { Corpus } from "../model/corpus";
import { ConfirmationService, ConfirmEventType, MessageService } from "primeng/api";



@Component({
  selector: 'app-corpus-detail',
  templateUrl: './corpus-detail.component.html',
  styleUrls: ['./corpus-detail.component.css']
})
export class CorpusDetailComponent implements OnInit {

  stateOptions = [{ label: 'No', value: false }, { label: 'Yes', value: true }];

  constructor(private corpusService: CorpusService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  submitted: boolean = false;

  corpusId = ''
  formMode = 'update'
  formEdited = false

  intent = 0
  examples: any[] = []
  intents: any[] = []
  lookups: any[] = []
  regexes: any[] = []
  synonyms: any[] = []

  corpus: Corpus = {
    corpusId: '',
    active: true,
    created: new Date(),
    updated: new Date(),
    comment: '',
    name: '',
    locale: '',
    nlu: {
      intents: [{ name: '', examples: [''] }],
      lookups: [{ name: '', examples: [''] }],
      synonyms: [{ name: '', examples: [''] }],
      regexes: [{ name: '', examples: [''] }]
    },

  }


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
  }

  getCorpusDetails(corpusId: string): void {
    this.corpusService.getCorpusDetail(corpusId)
      .subscribe(result => {
        this.corpus = result.payload
        console.log(this.corpus)
      })
    console.log(this.corpus)
  }

  setIntent(event: any) {
    this.examples = []
    this.intent = event.data
    this.corpus.nlu.intents[this.intent].examples.forEach(example => {
      this.examples.push({ id: Math.random() * 100, example: example })
    })

  }

  addNewIntent(value: string) {
    this.corpus.nlu.intents.push({
      name: value,
      examples: ['']
    })
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Record added' });
  }

  deleteIntent() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.corpus.nlu.intents.splice(this.intent, 1)
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
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

  addNewExample() {
    this.examples.push({ id: Math.random() * 100, example: '' })
    this.updateExample()
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Record added' });
  }

  updateExample() {
    this.corpus.nlu.intents[this.intent].examples = ['']
    this.corpus.nlu.intents[this.intent].examples.pop()
    this.examples.forEach(example => {
      this.corpus.nlu.intents[this.intent].examples.push(example.example)
    })
    console.log(this.corpus);

  }

  deleteExample(example: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.examples.filter(example.id, 1)
        this.updateExample();
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
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


  setformEdited(status: boolean) {
    this.formEdited = status
    if (status) {
      console.log('Form Editing start')
    } else {
      console.log('Form editing finished')
    }
  }

  saveChanges() {
    // this.corpus.data = this.intents
    // this.corpusService.updateCorpus(this.corpus).subscribe(
    //   r => this.messageService.add({ severity: 'info', summary: 'Changes Saved', detail: r.status })
    // )

  }
}
