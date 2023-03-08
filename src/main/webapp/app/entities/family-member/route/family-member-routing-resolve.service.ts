import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFamilyMember } from '../family-member.model';
import { FamilyMemberService } from '../service/family-member.service';

@Injectable({ providedIn: 'root' })
export class FamilyMemberRoutingResolveService implements Resolve<IFamilyMember | null> {
  constructor(protected service: FamilyMemberService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFamilyMember | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((familyMember: HttpResponse<IFamilyMember>) => {
          if (familyMember.body) {
            return of(familyMember.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
