import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFamilyMember } from '../family-member.model';

@Component({
  selector: 'jhi-family-member-detail',
  templateUrl: './family-member-detail.component.html',
})
export class FamilyMemberDetailComponent implements OnInit {
  familyMember: IFamilyMember | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ familyMember }) => {
      this.familyMember = familyMember;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
