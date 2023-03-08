import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFamily } from '../family.model';

@Component({
  selector: 'jhi-family-detail',
  templateUrl: './family-detail.component.html',
})
export class FamilyDetailComponent implements OnInit {
  family: IFamily | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ family }) => {
      this.family = family;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
