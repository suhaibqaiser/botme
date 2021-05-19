import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {CorpusService} from "../service/corpus.service";
import {Corpus} from "../model/corpus";
import {
  GuiColumn,
  GuiColumnAlign, GuiColumnCellEditing,
  GuiGridApi,
  GuiGridComponent,
  GuiPaging,
  GuiPagingDisplay,
  GuiRowColoring
} from "@generic-ui/ngx-grid";
import {GuiGridColumnCellEditingConverter} from "@generic-ui/ngx-grid/gui/grid/feature/grid/column/cell-editing/gui.grid.column-cell-editing.converter";

@Component({
  selector: 'app-corpus-detail',
  templateUrl: './corpus-detail.component.html',
  styleUrls: ['./corpus-detail.component.css']
})
export class CorpusDetailComponent implements OnInit, AfterViewInit {

  constructor(private corpusService: CorpusService, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  @ViewChild('utterance', {static: true})
  gridComponent: GuiGridComponent | any

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

  ngAfterViewInit(): void {
    const api: GuiGridApi = this.gridComponent.api;
    api.scrollToRowByIndex(1)
  }

  onItemSelected(phrases: Array<any>) {
    this.selectedRow = phrases[0].id
  }
}
