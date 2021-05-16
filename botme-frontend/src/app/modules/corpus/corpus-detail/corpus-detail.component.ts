import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {CorpusService} from "../service/corpus.service";
import {Corpus} from "../model/corpus";

@Component({
  selector: 'app-corpus-detail',
  templateUrl: './corpus-detail.component.html',
  styleUrls: ['./corpus-detail.component.css']
})
export class CorpusDetailComponent implements OnInit {

  constructor(private corpusService: CorpusService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  corpusForm = this.fb.group({
    formclientdeviceid: ['', Validators.required],
    formclientsecret: [''],
    formclientcomment: [''],
    formclientname: ['', Validators.required],
    formclientactive: true
  });

  corpusId = ''
  formMode = 'update'
  intent = 0
  contextData = [{
    zone:'',
    steps:''
  }]


  corpus: Corpus
    = {
    corpusId: '',
    active: true,
    comment: '',
    name: '',
    locale: '',
    data: [{
      intent: '',
      utterances: [''],
      answers: [{
        answer: '',
        opts: ''
      }]
    }],
    contextData: {}
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

  onSubmit(): void {
  }

  getCorpusDetails(corpusId: string): void {
    this.corpusService.getCorpusDetail(corpusId)
      .subscribe(result => {
          this.corpus = result.payload.corpus
          //console.log(this.corpus)

          // let cd = this.corpus.contextData
          // for (let key in cd) {
          //   if (cd.hasOwnProperty(key)) {
          //     this.contextData.push(cd[key])
          //   }
          //
          // }
          // console.log(this.contextData)

        }
      )
  }

  setIntent(intent: number) {
    this.intent = intent
  }
}
