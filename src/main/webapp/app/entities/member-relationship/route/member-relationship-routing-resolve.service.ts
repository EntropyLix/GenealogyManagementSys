import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMemberRelationship } from '../member-relationship.model';
import { MemberRelationshipService } from '../service/member-relationship.service';

@Injectable({ providedIn: 'root' })
export class MemberRelationshipRoutingResolveService implements Resolve<IMemberRelationship | null> {
  constructor(protected service: MemberRelationshipService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMemberRelationship | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((memberRelationship: HttpResponse<IMemberRelationship>) => {
          if (memberRelationship.body) {
            return of(memberRelationship.body);
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
