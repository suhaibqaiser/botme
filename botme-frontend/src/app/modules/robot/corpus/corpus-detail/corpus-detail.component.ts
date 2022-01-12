import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
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
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  submitted: boolean = false;

  type: string = 'intent';
  InputNewType: string = '';
  InputNewExample: string = '';
  corpusId = ''
  editMode = true;
  formEdited = false
  closable = true;

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
      this.editMode = false
      console.log(this.corpusService.getMaxCorpusId())
      this.corpusService.getMaxCorpusId().subscribe(res => {
        this.corpusId = res.payload + 1
        this.corpus.corpusId = this.corpusId
      })
    } else {
      this.getCorpusDetails(this.corpusId)
    }
  }

  getCorpusDetails(corpusId: string): void {
    this.corpusService.getCorpusDetail(corpusId)
      .subscribe(result => {
        this.corpus = result.payload
        this.corpus.nlu.intents.forEach(item => {
          this.intents.push({ id: this.getRandomId(), ...item })
        })
        this.corpus.nlu.lookups.forEach(item => {
          this.lookups.push({ id: this.getRandomId(), ...item })
        })
        this.corpus.nlu.regexes.forEach(item => {
          this.regexes.push({ id: this.getRandomId(), ...item })
        })
        this.corpus.nlu.synonyms.forEach(item => {
          this.synonyms.push({ id: this.getRandomId(), ...item })
        })
      })
  }

  setTypeOnTabChange(event: any): void {

    switch (event.index) {
      case 0:
        this.type = 'intent';
        break;
      case 1:
        this.type = 'lookup'
        break;
      case 2:
        this.type = 'regex'
        break;
      case 3:
        this.type = 'synonym'
        break;
      default:
        break;
    }
    this.examples = []
    console.log(this.type);

  }

  addNewType(type: string, value: string) {
    if (type === 'intent') {
      this.intents.push({
        id: this.getRandomId(),
        name: value,
        examples: []
      })
    } else if (type === 'lookup') {
      this.lookups.push({
        id: this.getRandomId(),
        name: value,
        examples: []
      })
    } else if (type === 'regex') {
      this.regexes.push({
        id: this.getRandomId(),
        name: value,
        examples: []
      })
    }
    else if (type === 'synonym') {
      this.synonyms.push({
        id: this.getRandomId(),
        name: value,
        examples: []
      })
    }
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Record added' });
    this.InputNewType = '';
  }

  deleteType(data: any) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        console.log(this.type, data);

        if (this.type === 'intent') {
          const index = this.intents.indexOf(data);
          if (index > -1) {
            this.intents.splice(index, 1);
          }
        } else if (this.type === 'lookup') {
          const index = this.lookups.indexOf(data);
          if (index > -1) {
            this.lookups.splice(index, 1);
          }
        } else if (this.type === 'regex') {
          const index = this.regexes.indexOf(data);
          if (index > -1) {
            this.regexes.splice(index, 1);
          }
        } else if (this.type === 'synonym') {
          const index = this.synonyms.indexOf(data);
          if (index > -1) {
            this.synonyms.splice(index, 1);
          }
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

  setExamples(event: any) {
    this.examples = []
    console.log(this.type, event.data);

    if (this.type === 'intent') {
      this.intent = this.intents.indexOf(event.data);
      this.intents[this.intent].examples.forEach((example: string) => {
        this.examples.push({ id: this.getRandomId(), example: example })
      })
    } else if (this.type === 'lookup') {
      this.lookup = this.lookups.indexOf(event.data);
      this.lookups[this.lookup].examples.forEach((example: string) => {
        this.examples.push({ id: this.getRandomId(), example: example })
      })
    } else if (this.type === 'regex') {
      this.regex = this.regexes.indexOf(event.data);
      this.regexes[this.regex].examples.forEach((example: string) => {
        this.examples.push({ id: this.getRandomId(), example: example })
      })
    } else if (this.type === 'synonym') {
      this.synonym = this.synonyms.indexOf(event.data);
      this.synonyms[this.synonym].examples.forEach((example: string) => {
        this.examples.push({ id: this.getRandomId(), example: example })
      })
    }
  }

  addNewExample() {
    this.examples.push({ id: this.getRandomId(), example: this.InputNewExample })
    this.updateExamples()
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Record added' });
    this.InputNewExample = ''
  }

  updateExamples() {
    if (this.type === 'intent') {
      this.intents[this.intent].examples = ['']
      this.intents[this.intent].examples.pop()
      this.examples.forEach(example => {
        this.intents[this.intent].examples.push(example.example)
      })
    } else if (this.type === 'lookup') {
      this.lookups[this.lookup].examples = ['']
      this.lookups[this.lookup].examples.pop()
      this.examples.forEach(example => {
        this.lookups[this.lookup].examples.push(example.example)
      })
    } else if (this.type === 'regex') {
      this.regexes[this.regex].examples = ['']
      this.regexes[this.regex].examples.pop()
      this.examples.forEach(example => {
        this.regexes[this.regex].examples.push(example.example)
      })
    } else if (this.type === 'synonym') {
      this.synonyms[this.synonym].examples = ['']
      this.synonyms[this.synonym].examples.pop()
      this.examples.forEach(example => {
        this.synonyms[this.synonym].examples.push(example.example)
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

        this.updateExamples();
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

  updateCorpus() {
    this.corpus.nlu.intents = [{ name: '', examples: [''] }]
    this.corpus.nlu.intents.pop()
    this.intents.forEach(intents => {
      this.corpus.nlu.intents.push({ name: intents.name, examples: intents.examples })
    });

    this.corpus.nlu.regexes = [{ name: '', examples: [''] }]
    this.corpus.nlu.regexes.pop()
    this.regexes.forEach(regexes => {
      this.corpus.nlu.regexes.push({ name: regexes.name, examples: regexes.examples })
    });

    this.corpus.nlu.lookups = [{ name: '', examples: [''] }]
    this.corpus.nlu.lookups.pop()
    this.lookups.forEach(lookups => {
      this.corpus.nlu.lookups.push({ name: lookups.name, examples: lookups.examples })
    });

    this.corpus.nlu.synonyms = [{ name: '', examples: [''] }]
    this.corpus.nlu.synonyms.pop()
    this.synonyms.forEach(synonyms => {
      this.corpus.nlu.synonyms.push({ name: synonyms.name, examples: synonyms.examples })
    });

  }

  saveChanges() {
    this.updateCorpus()

    this.corpusService.updateCorpus(this.corpus).subscribe(
      r => this.messageService.add({ severity: 'success', summary: 'Changes Saved', detail: r.status }),
      err => this.messageService.add({ severity: 'error', summary: 'Failed', detail: err.message }),
    )

  }
  addCorups() {
    this.updateCorpus()
    if (!this.corpus.corpusId || !this.corpus.name) {
      this.messageService.add({ severity: 'error', summary: 'Validation Failed', detail: 'Please enter corpus name' })
      return
    }

    this.corpusService.addCorpus(this.corpus).subscribe(
      r => {
        this.messageService.add({ severity: 'success', summary: 'Corpus Added', detail: r.status })
        this.router.navigateByUrl(`corpus/detail?corpusId=${this.corpusId}`)
        this.editMode = true
      },
      err => this.messageService.add({ severity: 'error', summary: 'Failed', detail: err.message }),
    )
  }

  getRandomId() {
    return Math.round(Math.random() * Math.random() * new Date().getTime() / 100000)
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    confirm("Changes you made may not be saved.");// stay on same page
  }
}
