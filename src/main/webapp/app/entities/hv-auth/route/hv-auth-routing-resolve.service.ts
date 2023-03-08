import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHvAuth } from '../hv-auth.model';
import { HvAuthService } from '../service/hv-auth.service';

@Injectable({ providedIn: 'root' })
export class HvAuthRoutingResolveService implements Resolve<IHvAuth | null> {
  constructor(protected service: HvAuthService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHvAuth | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((hvAuth: HttpResponse<IHvAuth>) => {
          if (hvAuth.body) {
            return of(hvAuth.body);
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
