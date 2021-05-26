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

  corpusId = ''
  formMode = 'update'
  formEdited = false
  intent = 0
  corpus: Corpus = {
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

  intents: any = []
  utterances: any = []
  answers: any = []

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
        this.corpus = result.payload.corpus
        console.log(this.corpus)

        for (const [i0, d] of this.corpus.data.entries()) {
          for (const [i1, u] of this.corpus.data[i0].utterances.entries()) {
            this.utterances.push({id: i1, phrase: u.phrase})
          }
          for (const [i2, a] of this.corpus.data[i0].answers.entries()) {
            this.answers.push({id: i2, answer: a.answer, opts: a.opts})
          }
          this.intents.push({id: i0, intent: d.intent, utterances: this.utterances, answers: this.answers})
          this.utterances = []
          this.answers = []
        }
      })
    console.log(this.corpus)
  }

  setIntent(intent: any) {
    this.intent = intent.data.id
    console.log(this.intents)
  }

  addNewIntent(val: string) {
    let nextId = this.intents.length
    this.intents.push({
      id: nextId,
      intent: val,
      utterances: [],
      answers: []
    })
    this.setIntent(nextId)
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'Record added'});
  }

  deleteIntent() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.intents.splice(this.intent, 1)
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

  addNewUtterance() {
    let nextId = this.intents[this.intent].utterances.length
    this.intents[this.intent].utterances.push({id: nextId, phrase: ''})
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'Record added'});
  }

  deleteUtterance(utterance: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.intents[this.intent].utterances.splice(utterance.id, 1)
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

  addNewAnswer() {
    let nextId = this.intents[this.intent].answers
    this.intents[this.intent].answers.push({
      id: nextId,
      answer: '',
      opts: ''
    })
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'Record added'});
  }

  deleteAnswer(answer: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.intents[this.intent].answers.splice(answer.id, 1)
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

  setformEdited(status: boolean) {
    this.formEdited = status
    if (status) {
      console.log('Form Editing start')
    } else {
      console.log('Form editing finished')
    }
  }

  saveChanges() {
    this.corpus.data = this.intents
    this.corpusService.updateCorpus(this.corpus).subscribe(
      r => this.messageService.add({severity: 'info', summary: 'Changes Saved', detail: r.status})
    )

  }
}
