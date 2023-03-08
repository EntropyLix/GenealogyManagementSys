import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMemberRelationship, NewMemberRelationship } from '../member-relationship.model';

export type PartialUpdateMemberRelationship = Partial<IMemberRelationship> & Pick<IMemberRelationship, 'id'>;

export type EntityResponseType = HttpResponse<IMemberRelationship>;
export type EntityArrayResponseType = HttpResponse<IMemberRelationship[]>;

@Injectable({ providedIn: 'root' })
export class MemberRelationshipService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/member-relationships');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(memberRelationship: NewMemberRelationship): Observable<EntityResponseType> {
    return this.http.post<IMemberRelationship>(this.resourceUrl, memberRelationship, { observe: 'response' });
  }

  update(memberRelationship: IMemberRelationship): Observable<EntityResponseType> {
    return this.http.put<IMemberRelationship>(
      `${this.resourceUrl}/${this.getMemberRelationshipIdentifier(memberRelationship)}`,
      memberRelationship,
      { observe: 'response' }
    );
  }

  partialUpdate(memberRelationship: PartialUpdateMemberRelationship): Observable<EntityResponseType> {
    return this.http.patch<IMemberRelationship>(
      `${this.resourceUrl}/${this.getMemberRelationshipIdentifier(memberRelationship)}`,
      memberRelationship,
      { observe: 'response' }
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IMemberRelationship>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMemberRelationship[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMemberRelationshipIdentifier(memberRelationship: Pick<IMemberRelationship, 'id'>): string {
    return memberRelationship.id;
  }

  compareMemberRelationship(o1: Pick<IMemberRelationship, 'id'> | null, o2: Pick<IMemberRelationship, 'id'> | null): boolean {
    return o1 && o2 ? this.getMemberRelationshipIdentifier(o1) === this.getMemberRelationshipIdentifier(o2) : o1 === o2;
  }

  addMemberRelationshipToCollectionIfMissing<Type extends Pick<IMemberRelationship, 'id'>>(
    memberRelationshipCollection: Type[],
    ...memberRelationshipsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const memberRelationships: Type[] = memberRelationshipsToCheck.filter(isPresent);
    if (memberRelationships.length > 0) {
      const memberRelationshipCollectionIdentifiers = memberRelationshipCollection.map(
        memberRelationshipItem => this.getMemberRelationshipIdentifier(memberRelationshipItem)!
      );
      const memberRelationshipsToAdd = memberRelationships.filter(memberRelationshipItem => {
        const memberRelationshipIdentifier = this.getMemberRelationshipIdentifier(memberRelationshipItem);
        if (memberRelationshipCollectionIdentifiers.includes(memberRelationshipIdentifier)) {
          return false;
        }
        memberRelationshipCollectionIdentifiers.push(memberRelationshipIdentifier);
        return true;
      });
      return [...memberRelationshipsToAdd, ...memberRelationshipCollection];
    }
    return memberRelationshipCollection;
  }
}
