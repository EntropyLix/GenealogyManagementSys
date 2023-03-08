import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFamilyMember } from '../family-member.model';
import { FamilyMemberService } from '../service/family-member.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './family-member-delete-dialog.component.html',
})
export class FamilyMemberDeleteDialogComponent {
  familyMember?: IFamilyMember;

  constructor(protected familyMemberService: FamilyMemberService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.familyMemberService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
