/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFamily } from '../family.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, FamilyService } from '../service/family.service';
import { FamilyDeleteDialogComponent } from '../delete/family-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { SessionStorageService } from 'ngx-webstorage';
import { GenealogyService } from 'app/genealogy/genealogy.service';

@Component({
  selector: 'jhi-family',
  templateUrl: './family.component.html',
})
export class FamilyComponent implements OnInit {
  families?: IFamily[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  canRead: any[] = [];
  canWrite: any[] = [];
  userName: any;
  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
  page = 1;

  constructor(
    protected familyService: FamilyService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    private genealogyService: GenealogyService,
    protected modalService: NgbModal,
    private sessionStorageService: SessionStorageService
  ) {}

  reset(): void {
    this.page = 1;
    this.families = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IFamily): string => this.familyService.getFamilyIdentifier(item);

  async ngOnInit(): Promise<void> {
    this.userName = this.sessionStorageService.retrieve('account')?.login;
    await this.getGroup();
    this.load();
  }

  delete(family: IFamily): void {
    const modalRef = this.modalService.open(FamilyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.family = family;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter((reason: any) => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
          this.reset();
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  checkCanWrite(family: any): boolean {
    return this.canWrite.find((item: any) => item.id === family.id) || this.userName === 'admin' || family.createdBy === this.userName;
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);

    this.families = dataFromBody.filter(
      (item: any) =>
        this.userName === 'admin' || item?.createdBy === this.userName || this.canRead.find((value: any) => value.id === item?.id)
    );
  }

  protected fillComponentAttributesFromResponseBody(data: IFamily[] | null): IFamily[] {
    const familiesNew = this.families ?? [];
    if (data) {
      for (const d of data) {
        if (familiesNew.map(op => op.id).indexOf(d.id) === -1) {
          familiesNew.push(d);
        }
      }
    }
    return familiesNew;
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.familyService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  private async getGroup(): Promise<any> {
    return new Promise<any>((resolve: any) => {
      this.genealogyService.queryGroup().subscribe((res: any) => {
        const group = res.filter((item: any) => (item.members as any[]).find((value: any) => value.login === this.userName));
        this.canRead = group.map((item: any) => item.reads).flat(Infinity);
        this.canWrite = group.map((item: any) => item.writes).flat(Infinity);
        resolve();
      });
    });
  }
}
