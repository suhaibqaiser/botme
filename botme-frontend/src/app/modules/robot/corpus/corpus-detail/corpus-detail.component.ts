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

  type: string = '';
  InputNewType: string = '';
  corpusId = ''
  formMode = 'update'
  formEdited = false

  intent = 0
  lookup = 0
  regex = 0
  synonym = 0

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

      })
  }


  addNewType(type: string, value: string) {
    if (type === 'intent') {
      this.corpus.nlu.intents.push({
        name: value,
        examples: ['']
      })
    } else if (type === 'lookup') {
      this.corpus.nlu.lookups.push({
        name: value,
        examples: ['']
      })
    } else if (type === 'regex') {
      this.corpus.nlu.regexes.push({
        name: value,
        examples: ['']
      })
    }
    else if (type === 'synonym') {
      this.corpus.nlu.synonyms.push({
        name: value,
        examples: ['']
      })
    }
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Record added' });
    this.InputNewType = '';
  }

  deleteType(type: string) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        if (type === 'intent') {
          this.corpus.nlu.intents.splice(this.intent, 1)
        } else if (type === 'lookup') {
          this.corpus.nlu.lookups.splice(this.intent, 1)
        } else if (type === 'regex') {
          this.corpus.nlu.regexes.splice(this.intent, 1)
        } else if (type === 'synonym') {
          this.corpus.nlu.synonyms.splice(this.intent, 1)
        }
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

  setType(type: string) {
    this.type = type;
  }

  setExamples(event: any, source: string) {
    this.setType(source)
    this.examples = []

    if (source === 'intent') {
      this.intent = event.data
      this.corpus.nlu.intents[this.intent].examples.forEach(example => {
        this.examples.push({ id: Math.round(Math.random() * 100), example: example })
      })
    } else if (source === 'lookup') {
      this.lookup = event.data
      this.corpus.nlu.lookups[this.lookup].examples.forEach(example => {
        this.examples.push({ id: Math.round(Math.random() * 100), example: example })
      })
    } else if (source === 'regex') {
      this.lookup = event.data
      this.corpus.nlu.regexes[this.regex].examples.forEach(example => {
        this.examples.push({ id: Math.round(Math.random() * 100), example: example })
      })
    } else if (source === 'synonym') {
      this.lookup = event.data
      this.corpus.nlu.synonyms[this.synonym].examples.forEach(example => {
        this.examples.push({ id: Math.round(Math.random() * 100), example: example })
      })
    }
  }

  addNewExample() {
    this.examples.push({ id: Math.round(Math.random() * 100), example: '' })
    this.updateExample(this.type)
    console.log(Math.round(Math.random() * 100));

    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Record added' });
  }

  updateExample(type: string) {
    if (type === 'intent') {
      this.corpus.nlu.intents[this.intent].examples = ['']
      this.corpus.nlu.intents[this.intent].examples.pop()
      this.examples.forEach(example => {
        this.corpus.nlu.intents[this.intent].examples.push(example.example)
      })
    } else if (type === 'lookup') {
      this.corpus.nlu.lookups[this.lookup].examples = ['']
      this.corpus.nlu.lookups[this.lookup].examples.pop()
      this.examples.forEach(example => {
        this.corpus.nlu.lookups[this.lookup].examples.push(example.example)
      })
    } else if (type === 'regex') {
      this.corpus.nlu.regexes[this.regex].examples = ['']
      this.corpus.nlu.regexes[this.regex].examples.pop()
      this.examples.forEach(example => {
        this.corpus.nlu.regexes[this.regex].examples.push(example.example)
      })
    } else if (type === 'synonym') {
      this.corpus.nlu.synonyms[this.synonym].examples = ['']
      this.corpus.nlu.synonyms[this.synonym].examples.pop()
      this.examples.forEach(example => {
        this.corpus.nlu.synonyms[this.synonym].examples.push(example.example)
      })
    }
  }

  deleteExample(example: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        const index = this.examples.indexOf(example);

        if (index > -1) {
          this.examples.splice(index, 1);
        }

        this.updateExample(this.type);
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


    this.corpusService.updateCorpus(this.corpus).subscribe(
      r => this.messageService.add({ severity: 'info', summary: 'Changes Saved', detail: r.status }),
      err => this.messageService.add({ severity: 'error', summary: 'Failed', detail: err.message }),
    )

  }
}
