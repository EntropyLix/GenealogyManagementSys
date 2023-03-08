import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FamilyMemberComponent } from '../list/family-member.component';
import { FamilyMemberDetailComponent } from '../detail/family-member-detail.component';
import { FamilyMemberUpdateComponent } from '../update/family-member-update.component';
import { FamilyMemberRoutingResolveService } from './family-member-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const familyMemberRoute: Routes = [
  {
    path: '',
    component: FamilyMemberComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FamilyMemberDetailComponent,
    resolve: {
      familyMember: FamilyMemberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FamilyMemberUpdateComponent,
    resolve: {
      familyMember: FamilyMemberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FamilyMemberUpdateComponent,
    resolve: {
      familyMember: FamilyMemberRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(familyMemberRoute)],
  exports: [RouterModule],
})
export class FamilyMemberRoutingModule {}
