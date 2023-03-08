import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GroupComponent } from './list/group.component';
import { GroupDetailComponent } from './detail/group-detail.component';
import { GroupUpdateComponent } from './update/group-update.component';
import { GroupDeleteDialogComponent } from './delete/group-delete-dialog.component';
import { GroupRoutingModule } from './route/group-routing.module';
import { PickListModule } from 'primeng/picklist';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [SharedModule, GroupRoutingModule, ButtonModule, PickListModule, TabViewModule],
  declarations: [GroupComponent, GroupDetailComponent, GroupUpdateComponent, GroupDeleteDialogComponent],
})
export class GroupModule {}
