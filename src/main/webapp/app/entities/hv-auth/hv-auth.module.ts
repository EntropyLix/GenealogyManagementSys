import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HvAuthComponent } from './list/hv-auth.component';
import { HvAuthDetailComponent } from './detail/hv-auth-detail.component';
import { HvAuthUpdateComponent } from './update/hv-auth-update.component';
import { HvAuthDeleteDialogComponent } from './delete/hv-auth-delete-dialog.component';
import { HvAuthRoutingModule } from './route/hv-auth-routing.module';

@NgModule({
  imports: [SharedModule, HvAuthRoutingModule],
  declarations: [HvAuthComponent, HvAuthDetailComponent, HvAuthUpdateComponent, HvAuthDeleteDialogComponent],
})
export class HvAuthModule {}
