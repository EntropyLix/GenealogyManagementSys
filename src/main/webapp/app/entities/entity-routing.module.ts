import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'family',
        data: { pageTitle: 'genealogyManagementSystemApp.family.home.title' },
        loadChildren: () => import('./family/family.module').then(m => m.FamilyModule),
      },
      {
        path: 'family-member',
        data: { pageTitle: 'genealogyManagementSystemApp.familyMember.home.title' },
        loadChildren: () => import('./family-member/family-member.module').then(m => m.FamilyMemberModule),
      },
      {
        path: 'hv-auth',
        data: { pageTitle: 'genealogyManagementSystemApp.hvAuth.home.title' },
        loadChildren: () => import('./hv-auth/hv-auth.module').then(m => m.HvAuthModule),
      },
      {
        path: 'member-relationship',
        data: { pageTitle: 'genealogyManagementSystemApp.memberRelationship.home.title' },
        loadChildren: () => import('./member-relationship/member-relationship.module').then(m => m.MemberRelationshipModule),
      },
      {
        path: 'group',
        data: { pageTitle: 'genealogyManagementSystemApp.group.home.title' },
        loadChildren: () => import('./group/group.module').then(m => m.GroupModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
