import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Corpus } from '../model/corpus';
import { CorpusService } from "../service/corpus.service";

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

  corpus: Array<Corpus> = []
  loading = true;

  getCorpus(): void {
    this.corpusService.getCorpus()
      .subscribe(result => {
        this.corpus = result.payload
        this.loading = false;
      })
  }

  clear(table: Table) {
    table.clear();
  }
}
