import { Route } from '@angular/router';
import { GenealogyComponent } from './genealogy.component';

export const GENEALOGY_ROUTE: Route = {
  path: '',
  component: GenealogyComponent,
  data: {
    pageTitle: 'home.title',
  },
};
