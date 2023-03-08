import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMemberRelationship } from '../member-relationship.model';
import { MemberRelationshipService } from '../service/member-relationship.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './member-relationship-delete-dialog.component.html',
})
export class MemberRelationshipDeleteDialogComponent {
  memberRelationship?: IMemberRelationship;

  constructor(protected memberRelationshipService: MemberRelationshipService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.memberRelationshipService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
