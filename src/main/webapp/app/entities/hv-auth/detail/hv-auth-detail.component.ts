import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHvAuth } from '../hv-auth.model';

@Component({
  selector: 'jhi-hv-auth-detail',
  templateUrl: './hv-auth-detail.component.html',
})
export class HvAuthDetailComponent implements OnInit {
  hvAuth: IHvAuth | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hvAuth }) => {
      this.hvAuth = hvAuth;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
