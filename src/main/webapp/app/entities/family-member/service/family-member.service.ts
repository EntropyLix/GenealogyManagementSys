import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFamilyMember, NewFamilyMember } from '../family-member.model';

export type PartialUpdateFamilyMember = Partial<IFamilyMember> & Pick<IFamilyMember, 'id'>;

type RestOf<T extends IFamilyMember | NewFamilyMember> = Omit<T, 'birthDate'> & {
  birthDate?: string | null;
};

export type RestFamilyMember = RestOf<IFamilyMember>;

export type NewRestFamilyMember = RestOf<NewFamilyMember>;

export type PartialUpdateRestFamilyMember = RestOf<PartialUpdateFamilyMember>;

export type EntityResponseType = HttpResponse<IFamilyMember>;
export type EntityArrayResponseType = HttpResponse<IFamilyMember[]>;

@Injectable({ providedIn: 'root' })
export class FamilyMemberService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/family-members');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(familyMember: NewFamilyMember): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(familyMember);
    return this.http
      .post<RestFamilyMember>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(familyMember: IFamilyMember): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(familyMember);
    return this.http
      .put<RestFamilyMember>(`${this.resourceUrl}/${this.getFamilyMemberIdentifier(familyMember)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(familyMember: PartialUpdateFamilyMember): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(familyMember);
    return this.http
      .patch<RestFamilyMember>(`${this.resourceUrl}/${this.getFamilyMemberIdentifier(familyMember)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestFamilyMember>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFamilyMember[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFamilyMemberIdentifier(familyMember: Pick<IFamilyMember, 'id'>): string {
    return familyMember.id;
  }

  compareFamilyMember(o1: Pick<IFamilyMember, 'id'> | null, o2: Pick<IFamilyMember, 'id'> | null): boolean {
    return o1 && o2 ? this.getFamilyMemberIdentifier(o1) === this.getFamilyMemberIdentifier(o2) : o1 === o2;
  }

  addFamilyMemberToCollectionIfMissing<Type extends Pick<IFamilyMember, 'id'>>(
    familyMemberCollection: Type[],
    ...familyMembersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const familyMembers: Type[] = familyMembersToCheck.filter(isPresent);
    if (familyMembers.length > 0) {
      const familyMemberCollectionIdentifiers = familyMemberCollection.map(
        familyMemberItem => this.getFamilyMemberIdentifier(familyMemberItem)!
      );
      const familyMembersToAdd = familyMembers.filter(familyMemberItem => {
        const familyMemberIdentifier = this.getFamilyMemberIdentifier(familyMemberItem);
        if (familyMemberCollectionIdentifiers.includes(familyMemberIdentifier)) {
          return false;
        }
        familyMemberCollectionIdentifiers.push(familyMemberIdentifier);
        return true;
      });
      return [...familyMembersToAdd, ...familyMemberCollection];
    }
    return familyMemberCollection;
  }

  protected convertDateFromClient<T extends IFamilyMember | NewFamilyMember | PartialUpdateFamilyMember>(familyMember: T): RestOf<T> {
    return {
      ...familyMember,
      birthDate: familyMember.birthDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFamilyMember: RestFamilyMember): IFamilyMember {
    return {
      ...restFamilyMember,
      birthDate: restFamilyMember.birthDate ? dayjs(restFamilyMember.birthDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFamilyMember>): HttpResponse<IFamilyMember> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFamilyMember[]>): HttpResponse<IFamilyMember[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
