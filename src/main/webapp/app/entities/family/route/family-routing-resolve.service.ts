import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFamily } from '../family.model';
import { FamilyService } from '../service/family.service';

@Injectable({ providedIn: 'root' })
export class FamilyRoutingResolveService implements Resolve<IFamily | null> {
  constructor(protected service: FamilyService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFamily | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((family: HttpResponse<IFamily>) => {
          if (family.body) {
            return of(family.body);
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
