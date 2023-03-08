import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IFamily } from 'app/entities/family/family.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  protected queryUrl = this.applicationConfigService.getEndpointFor('api/families_by_name/');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  findFamiliesByName(name: string): Observable<any> {
    return this.http.get(`${this.queryUrl}/${name}`);
  }
}
