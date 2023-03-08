import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHvAuth } from '../hv-auth.model';
import { HvAuthService } from '../service/hv-auth.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './hv-auth-delete-dialog.component.html',
})
export class HvAuthDeleteDialogComponent {
  hvAuth?: IHvAuth;

  constructor(protected hvAuthService: HvAuthService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.hvAuthService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
