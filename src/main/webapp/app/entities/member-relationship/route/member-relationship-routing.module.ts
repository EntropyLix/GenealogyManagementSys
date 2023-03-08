import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MemberRelationshipComponent } from '../list/member-relationship.component';
import { MemberRelationshipDetailComponent } from '../detail/member-relationship-detail.component';
import { MemberRelationshipUpdateComponent } from '../update/member-relationship-update.component';
import { MemberRelationshipRoutingResolveService } from './member-relationship-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const memberRelationshipRoute: Routes = [
  {
    path: '',
    component: MemberRelationshipComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MemberRelationshipDetailComponent,
    resolve: {
      memberRelationship: MemberRelationshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MemberRelationshipUpdateComponent,
    resolve: {
      memberRelationship: MemberRelationshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MemberRelationshipUpdateComponent,
    resolve: {
      memberRelationship: MemberRelationshipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(memberRelationshipRoute)],
  exports: [RouterModule],
})
export class MemberRelationshipRoutingModule {}
