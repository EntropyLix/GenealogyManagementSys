import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FamilyComponent } from '../list/family.component';
import { FamilyDetailComponent } from '../detail/family-detail.component';
import { FamilyUpdateComponent } from '../update/family-update.component';
import { FamilyRoutingResolveService } from './family-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const familyRoute: Routes = [
  {
    path: '',
    component: FamilyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FamilyDetailComponent,
    resolve: {
      family: FamilyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FamilyUpdateComponent,
    resolve: {
      family: FamilyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FamilyUpdateComponent,
    resolve: {
      family: FamilyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(familyRoute)],
  exports: [RouterModule],
})
export class FamilyRoutingModule {}
