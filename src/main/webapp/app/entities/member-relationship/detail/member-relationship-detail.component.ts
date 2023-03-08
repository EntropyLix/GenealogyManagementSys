import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMemberRelationship } from '../member-relationship.model';

@Component({
  selector: 'jhi-member-relationship-detail',
  templateUrl: './member-relationship-detail.component.html',
})
export class MemberRelationshipDetailComponent implements OnInit {
  memberRelationship: IMemberRelationship | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ memberRelationship }) => {
      this.memberRelationship = memberRelationship;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
