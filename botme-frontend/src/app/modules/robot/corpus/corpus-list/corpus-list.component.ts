import { Component, OnInit } from '@angular/core';
import {CorpusService} from "../service/corpus.service";

@Component({
  selector: 'app-corpus-list',
  templateUrl: './corpus-list.component.html',
  styleUrls: ['./corpus-list.component.css']
})
export class CorpusListComponent implements OnInit {

  constructor(private corpusService: CorpusService) { }

  ngOnInit(): void {
    this.getCorpus()
  }

  corpus: Array<any> = []
  selectedCorpus?: string

  onSelect(corpus: any): void {
    this.selectedCorpus = corpus.corpusId
  }

  getCorpus(): void {
    this.corpusService.getCorpus()
      .subscribe(result => this.corpus = result.payload)
  }


}
