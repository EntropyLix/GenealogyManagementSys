import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHvAuth, NewHvAuth } from '../hv-auth.model';

export type PartialUpdateHvAuth = Partial<IHvAuth> & Pick<IHvAuth, 'id'>;

export type EntityResponseType = HttpResponse<IHvAuth>;
export type EntityArrayResponseType = HttpResponse<IHvAuth[]>;

@Injectable({ providedIn: 'root' })
export class HvAuthService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hv-auths');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(hvAuth: NewHvAuth): Observable<EntityResponseType> {
    return this.http.post<IHvAuth>(this.resourceUrl, hvAuth, { observe: 'response' });
  }

  update(hvAuth: IHvAuth): Observable<EntityResponseType> {
    return this.http.put<IHvAuth>(`${this.resourceUrl}/${this.getHvAuthIdentifier(hvAuth)}`, hvAuth, { observe: 'response' });
  }

  partialUpdate(hvAuth: PartialUpdateHvAuth): Observable<EntityResponseType> {
    return this.http.patch<IHvAuth>(`${this.resourceUrl}/${this.getHvAuthIdentifier(hvAuth)}`, hvAuth, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IHvAuth>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHvAuth[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHvAuthIdentifier(hvAuth: Pick<IHvAuth, 'id'>): string {
    return hvAuth.id;
  }

  compareHvAuth(o1: Pick<IHvAuth, 'id'> | null, o2: Pick<IHvAuth, 'id'> | null): boolean {
    return o1 && o2 ? this.getHvAuthIdentifier(o1) === this.getHvAuthIdentifier(o2) : o1 === o2;
  }

  addHvAuthToCollectionIfMissing<Type extends Pick<IHvAuth, 'id'>>(
    hvAuthCollection: Type[],
    ...hvAuthsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const hvAuths: Type[] = hvAuthsToCheck.filter(isPresent);
    if (hvAuths.length > 0) {
      const hvAuthCollectionIdentifiers = hvAuthCollection.map(hvAuthItem => this.getHvAuthIdentifier(hvAuthItem)!);
      const hvAuthsToAdd = hvAuths.filter(hvAuthItem => {
        const hvAuthIdentifier = this.getHvAuthIdentifier(hvAuthItem);
        if (hvAuthCollectionIdentifiers.includes(hvAuthIdentifier)) {
          return false;
        }
        hvAuthCollectionIdentifiers.push(hvAuthIdentifier);
        return true;
      });
      return [...hvAuthsToAdd, ...hvAuthCollection];
    }
    return hvAuthCollection;
  }
}
