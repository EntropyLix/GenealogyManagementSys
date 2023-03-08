import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenealogyService {
  protected queryUrl = this.applicationConfigService.getEndpointFor('api/families_by_name/');
  protected searchPathUrl = this.applicationConfigService.getEndpointFor('api/find-path-by-family/');
  protected memberUrl = this.applicationConfigService.getEndpointFor('api/family-members/');
  protected relastionshipUrl = this.applicationConfigService.getEndpointFor('api/family-members-relastionship');
  protected groupsUrl = this.applicationConfigService.getEndpointFor('api/groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  findFamiliesByName(name: string): Observable<any> {
    return this.http.get(`${this.queryUrl}/${name}`);
  }

  findFamiliesPathById(id: string): Observable<any> {
    return this.http.get(`${this.searchPathUrl}/${id}`);
  }

  deleteFamilyMemberById(id: string): Observable<any> {
    return this.http.delete(`${this.memberUrl}/${id}`);
  }

  updateFamilyMemberById(id: string, member: any): Observable<any> {
    return this.http.patch(`${this.memberUrl}/${id}`, member);
  }

  saveMember(member: any): Observable<any> {
    return this.http.post(`${this.memberUrl}`, member);
  }

  saveRelastionship(relastionship: any): Observable<any> {
    return this.http.post(`${this.relastionshipUrl}`, relastionship);
  }

  queryGroup(): Observable<any> {
    return this.http.get(this.groupsUrl);
  }
}
