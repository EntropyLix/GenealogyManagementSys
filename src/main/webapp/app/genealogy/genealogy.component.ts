import { filter } from 'rxjs';
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-extra-boolean-cast */
import { MenuItem, MessageService, SelectItem, ConfirmationService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GenealogyService } from './genealogy.service';
import { map } from 'rxjs/operators';
import $ from 'jquery';
import { GENEALOGY_SRC, SORT_MAPPING } from './genalogy.data';
import { Chart } from 'angular-highcharts';
import { SessionStorageService } from 'ngx-webstorage';
import { resolve } from 'cypress/types/bluebird';

@Component({
  selector: 'jhi-genealogy',
  templateUrl: './genealogy.component.html',
  styleUrls: ['./genealogy.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class GenealogyComponent implements OnInit {
  public chart?: Chart;
  public families: any[];
  public sortKey?: string;
  public sortOptions: SelectItem[];
  public dialogDisplay: boolean;
  public detailDisplay: boolean;
  public editlDisplay: boolean;
  public relationshipDisplay: boolean;
  public detail: any;
  public members: any[];
  public tempMembers: any[];
  public dialItems: MenuItem[];
  public canRead: any[];
  public canWrite: any[];
  public familyId?: any;
  public nodes?: any;
  public searchForm = this.fb.group({
    searchName: [],
  });
  public editForm = this.fb.group({
    name: [],
    age: [],
    gender: [],
    address: [],
    birthDate: [],
  });
  public relationForm = this.fb.group({
    fromId: [],
    toId: [],
    relationshipName: [],
  });

  private FAMILIY_MEMBER = 'FamilyMember';
  private chartSrc: any;
  private family?: any;
  private userName?: any;

  constructor(
    private fb: FormBuilder,
    private genealogyService: GenealogyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sessionStorageService: SessionStorageService
  ) {
    this.families = [];
    this.members = [];
    this.tempMembers = [];
    this.canRead = [];
    this.canWrite = [];
    this.dialogDisplay = false;
    this.detailDisplay = false;
    this.relationshipDisplay = false;
    this.editlDisplay = false;
    this.chartSrc = GENEALOGY_SRC;
    this.chartSrc['plotOptions']['networkgraph']['events'] = {
      click: (event: any) => {
        this.detail = event['point']['properties'];
        this.detailDisplay = true;
      },
    };
    this.sortOptions = [
      { label: 'A->Z', value: 'familyName' },
      { label: 'Z->A', value: '!familyName' },
    ];
    this.dialItems = [
      {
        tooltipOptions: {
          tooltipLabel: 'Topology Export',
        },
        tooltip: 'Topology Export',
        icon: 'pi pi-file-export',
        command: () => {
          this.messageService.add({ severity: 'success', summary: 'Topology Export', detail: 'Click The Topology Export' });
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'Image Recognition',
        },
        tooltip: 'Image Recognition',
        icon: 'pi pi-slack',
        command: () => {
          this.messageService.add({ severity: 'success', summary: 'Image Recognition', detail: 'Click The Image Recognition' });
        },
      },
      // {
      //   tooltipOptions: {
      //     tooltipLabel: 'Delete',
      //   },
      //   tooltip: 'Delete',
      //   icon: 'pi pi-trash',
      //   command: () => {
      //     this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
      //   },
      // },
      {
        tooltipOptions: {
          tooltipLabel: 'New Relationship',
        },
        tooltip: 'New Relationship',
        icon: 'pi pi-sitemap',
        command: () => {
          if (
            this.userName === 'admin' ||
            this.canWrite.find((item: any) => item.id === this.familyId) ||
            this.family.createdBy === this.userName
          ) {
            this.prepareRelastionshipData();
            this.relationshipDisplay = true;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Sorry, U dun hv auth to modify this family' });
          }
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'New Member',
        },
        icon: 'pi pi-user-plus',
        command: () => {
          if (
            this.userName === 'admin' ||
            this.canWrite.find((item: any) => item.id === this.familyId) ||
            this.family.createdBy === this.userName
          ) {
            this.detail = [];
            this.editForm.reset();
            this.detailDisplay = false;
            this.editlDisplay = true;
          } else {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Sorry, U dun hv auth to modify this family' });
          }
        },
      },
    ];
  }

  prepareRelastionshipData(): void {
    this.members = this.nodes.map((item: any) => {
      const maps = this.getDetailMap(item.properties);
      return { label: maps.name, value: maps.id };
    });
    this.tempMembers = Object.assign([], this.members);
  }

  createRlationship(): void {
    const value = this.relationForm.getRawValue();
    const rawValue = { ...value, fromId: (value?.fromId as any).value, toId: (value?.toId as any).value };
    if (rawValue.fromId === rawValue.toId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'WARN',
        detail: 'Can Not Create The Relationship To Itself',
      });
    } else {
      this.genealogyService.saveRelastionship(rawValue).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: rawValue.relationshipName + 'Create Success',
          });
          this.relationshipDisplay = false;
          this.detailDisplay = false;
          this.getFamilyDataToGraph(this.familyId);
          this.relationForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: rawValue.relationshipName + '  Create Failed' });
        }
      );
    }
  }

  autoComplete(event: any): void {
    const query = event.query;
    this.tempMembers = Object.assign([], this.members).filter((item: any) => (item.label as string).indexOf(query) >= 0);
  }

  openEditDialog(): void {
    const detailMap = this.getDetailMap(this.detail);
    const birthDate = Reflect.get(detailMap, 'birthDate') as string;
    Reflect.set(detailMap, 'birthDate', birthDate.substring(0, birthDate.indexOf('T')));
    this.editlDisplay = true;
    this.editForm.reset(detailMap);
  }

  submit(): void {
    const rawValue = this.editForm.getRawValue();
    // const data =this.editForm.getRawValue()
    const id = this.getDetailMap(this.detail)?.id;
    if (!!id) {
      const data = { ...rawValue, birthDate: new Date(rawValue.birthDate as unknown as string), id };
      this.genealogyService.updateFamilyMemberById(id, data).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: Reflect.get(data, 'name') + ' Modify Success',
          });
          this.editlDisplay = false;
          this.detailDisplay = false;
          this.getFamilyDataToGraph(this.familyId);
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: Reflect.get(data, 'name') + '  Modify Failed' });
        }
      );
    } else {
      const data = { ...rawValue, birthDate: new Date(rawValue.birthDate as unknown as string), family: this.family };
      this.genealogyService.saveMember(data).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: Reflect.get(data, 'name') + ' Create Success',
          });
          this.editlDisplay = false;
          this.detailDisplay = false;
          this.getFamilyDataToGraph(this.familyId);
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: Reflect.get(data, 'name') + '  Create Failed' });
        }
      );
    }
  }

  confirmDelete(detail: any[]): void {
    const detailMap = this.getDetailMap(detail);
    this.confirmationService.confirm({
      message:
        'Are you sure that u wanna delete the Family Member of  &nbsp;&nbsp;<span class="detail-name">' +
        Reflect.get(detailMap, 'name') +
        '</span>',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.genealogyService.deleteFamilyMemberById(Reflect.get(detailMap, 'id')).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: Reflect.get(detailMap, 'name') + ' Delete Success',
            });
            this.detailDisplay = false;
            this.getFamilyDataToGraph(this.familyId);
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: Reflect.get(detailMap, 'name') + ' Delete Failed' });
          }
        );
      },
    });
  }

  showDetailTopology(family: any): void {
    this.dialogDisplay = true;
    this.familyId = family.id;
    this.family = family;
    this.getFamilyDataToGraph(family.id);
  }

  getFamilyDataToGraph(id: any): void {
    const blockIds: any[] = [];
    this.genealogyService.findFamiliesPathById(id).subscribe((res: any) => {
      const nodes = res.nodes
        .filter((item: any) => {
          let isBlock = false;
          isBlock = item.name !== this.FAMILIY_MEMBER || item?.properties?.family?.id !== this.familyId;
          if (isBlock) {
            blockIds.push(item.id);
          }
          return !isBlock;
        })
        .map((item: any) => {
          const properties = item.properties;
          // const blockValue = [];
          for (const [key, value] of new Map(Object.entries(properties))) {
            if (typeof value === 'object') {
              // blockValue.push(key);
              Reflect.deleteProperty(properties, key);
            }
          }
          Reflect.set(
            item,
            'properties',
            Array.from(new Map(Object.entries(properties))).sort(
              (a: any, b: any) => Reflect.get(SORT_MAPPING, b[0]) - Reflect.get(SORT_MAPPING, a[0])
            )
          );
          return item;
        });
      this.nodes = nodes;
      this.chartSrc.series[0].nodes = nodes;
      this.chartSrc.series[0].data = res.data.filter(
        (item: any) => !blockIds.includes(item.from) && !blockIds.includes(item.to) && item.category !== 'HAS_AUTHORITY'
      );
      this.chart = new Chart(this.chartSrc);
    });
  }

  checkCanWrite(familyId: any): boolean {
    return this.canWrite.find((item: any) => item.id === familyId) || this.userName === 'admin' || this.family.createdBy === this.userName;
  }

  search(): void {
    const value: string = this.searchForm.get(['searchName'])?.value?.trim() || 'SEARCH_ALL';
    // if (!!value) {
    this.genealogyService
      .findFamiliesByName(value)
      .pipe(map((res: any) => this.addListOfIndex(res)))
      .subscribe(
        (list: any) => {
          if (!list.length) {
            this.showBlock();
          } else {
            this.hideBlock();
          }
          this.families = list.filter(
            (item: any) =>
              this.userName === 'admin' || item?.createdBy === this.userName || this.canRead.find((value: any) => value.id === item?.id)
          );

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Search Success.' });
        },
        (error: any) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: JSON.stringify(error) });
        }
      );
    // } else {
    //   this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Pls insert a value to search.' });
    // }
  }

  onSortChange(): void {
    if (this.sortKey?.indexOf('!') === 0) {
      this.sort(-1);
    } else {
      this.sort(1);
    }
  }

  /**
   * to fix the let-i="index" not work
   * @param data
   */
  addListOfIndex(data: any[]): any[] {
    return data.map((item: any, index: number) => {
      Reflect.set(item, 'index', index + 1);
      return item;
    });
  }

  sort(order: number): void {
    const families = [...this.families];
    families.sort((data1, data2) => {
      const value1 = data1.familyName;
      const value2 = data2.familyName;
      const result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return order * result;
    });

    this.families = this.addListOfIndex(families);
  }

  async ngOnInit(): Promise<void> {
    this.userName = this.sessionStorageService.retrieve('account')?.login;
    await this.getGroup();
    this.search();
  }

  private async getGroup(): Promise<any> {
    return new Promise<any>((resolve: any) => {
      this.genealogyService.queryGroup().subscribe((res: any) => {
        const group = res.filter((item: any) => (item.members as any[])?.find((value: any) => value.login === this.userName));
        this.canRead = group.map((item: any) => item.reads).flat(Infinity);
        this.canWrite = group.map((item: any) => item.writes).flat(Infinity);
        resolve();
      });
    });
  }

  private showBlock(): void {
    $('#blockUI').removeClass('blocked-hide').addClass('blocked-show');
  }

  private hideBlock(): void {
    $('#blockUI').removeClass('blocked-show').addClass('blocked-hide');
  }

  private getDetailMap(detail: any[]): any {
    const detailMap = {};
    if (detail.length) {
      detail.forEach(item => Reflect.set(detailMap, item[0], item[1]));
    }
    return detailMap;
  }
}
