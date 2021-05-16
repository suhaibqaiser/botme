import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CorpusListComponent} from "./corpus-list/corpus-list.component";
import {CorpusDetailComponent} from "./corpus-detail/corpus-detail.component";

const routes: Routes = [
  {
    path: '',
    data: {pageTitle: 'Corpus List'},
    component: CorpusListComponent
  },
  {
    path: 'detail',
    component: CorpusDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorpusRoutingModule {
}
