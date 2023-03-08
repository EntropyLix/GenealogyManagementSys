import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HvAuthComponent } from '../list/hv-auth.component';
import { HvAuthDetailComponent } from '../detail/hv-auth-detail.component';
import { HvAuthUpdateComponent } from '../update/hv-auth-update.component';
import { HvAuthRoutingResolveService } from './hv-auth-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const hvAuthRoute: Routes = [
  {
    path: '',
    component: HvAuthComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HvAuthDetailComponent,
    resolve: {
      hvAuth: HvAuthRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HvAuthUpdateComponent,
    resolve: {
      hvAuth: HvAuthRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HvAuthUpdateComponent,
    resolve: {
      hvAuth: HvAuthRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hvAuthRoute)],
  exports: [RouterModule],
})
export class HvAuthRoutingModule {}
