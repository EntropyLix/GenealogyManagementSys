import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFamily, NewFamily } from '../family.model';

export type PartialUpdateFamily = Partial<IFamily> & Pick<IFamily, 'id'>;

export type EntityResponseType = HttpResponse<IFamily>;
export type EntityArrayResponseType = HttpResponse<IFamily[]>;

@Injectable({ providedIn: 'root' })
export class FamilyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/families');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(family: NewFamily): Observable<EntityResponseType> {
    return this.http.post<IFamily>(this.resourceUrl, family, { observe: 'response' });
  }

  update(family: IFamily): Observable<EntityResponseType> {
    return this.http.put<IFamily>(`${this.resourceUrl}/${this.getFamilyIdentifier(family)}`, family, { observe: 'response' });
  }

  partialUpdate(family: PartialUpdateFamily): Observable<EntityResponseType> {
    return this.http.patch<IFamily>(`${this.resourceUrl}/${this.getFamilyIdentifier(family)}`, family, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IFamily>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFamily[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFamilyIdentifier(family: Pick<IFamily, 'id'>): string {
    return family.id;
  }

  compareFamily(o1: Pick<IFamily, 'id'> | null, o2: Pick<IFamily, 'id'> | null): boolean {
    return o1 && o2 ? this.getFamilyIdentifier(o1) === this.getFamilyIdentifier(o2) : o1 === o2;
  }

  addFamilyToCollectionIfMissing<Type extends Pick<IFamily, 'id'>>(
    familyCollection: Type[],
    ...familiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const families: Type[] = familiesToCheck.filter(isPresent);
    if (families.length > 0) {
      const familyCollectionIdentifiers = familyCollection.map(familyItem => this.getFamilyIdentifier(familyItem)!);
      const familiesToAdd = families.filter(familyItem => {
        const familyIdentifier = this.getFamilyIdentifier(familyItem);
        if (familyCollectionIdentifiers.includes(familyIdentifier)) {
          return false;
        }
        familyCollectionIdentifiers.push(familyIdentifier);
        return true;
      });
      return [...familiesToAdd, ...familyCollection];
    }
    return familyCollection;
  }
}
