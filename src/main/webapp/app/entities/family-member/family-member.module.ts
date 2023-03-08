import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FamilyMemberComponent } from './list/family-member.component';
import { FamilyMemberDetailComponent } from './detail/family-member-detail.component';
import { FamilyMemberUpdateComponent } from './update/family-member-update.component';
import { FamilyMemberDeleteDialogComponent } from './delete/family-member-delete-dialog.component';
import { FamilyMemberRoutingModule } from './route/family-member-routing.module';

@NgModule({
  imports: [SharedModule, FamilyMemberRoutingModule],
  declarations: [FamilyMemberComponent, FamilyMemberDetailComponent, FamilyMemberUpdateComponent, FamilyMemberDeleteDialogComponent],
})
export class FamilyMemberModule {}
