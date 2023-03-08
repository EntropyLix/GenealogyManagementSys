import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MemberRelationshipComponent } from './list/member-relationship.component';
import { MemberRelationshipDetailComponent } from './detail/member-relationship-detail.component';
import { MemberRelationshipUpdateComponent } from './update/member-relationship-update.component';
import { MemberRelationshipDeleteDialogComponent } from './delete/member-relationship-delete-dialog.component';
import { MemberRelationshipRoutingModule } from './route/member-relationship-routing.module';

@NgModule({
  imports: [SharedModule, MemberRelationshipRoutingModule],
  declarations: [
    MemberRelationshipComponent,
    MemberRelationshipDetailComponent,
    MemberRelationshipUpdateComponent,
    MemberRelationshipDeleteDialogComponent,
  ],
})
export class MemberRelationshipModule {}
