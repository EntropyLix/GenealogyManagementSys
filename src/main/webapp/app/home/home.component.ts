/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-empty */
/* eslint-disable require-yield */
import { SessionStorageService } from 'ngx-webstorage';
import { IFamily } from 'app/entities/family/family.model';
import { HomeService } from './home.service';
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { FormBuilder } from '@angular/forms';
import $ from 'jquery';
import { PIC } from './home.data';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  changeBackground?: Subscription;
  picGenerator: Generator;
  dockBasicItems: MenuItem[];
  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, private sessionStorageService: SessionStorageService) {
    this.picGenerator = this.genPic();
    this.dockBasicItems = [
      {
        label: 'Family Maintain',
        icon: 'people-arrows',
        routerLink: '/family',
      },
      {
        label: 'Genealogy Maintain',
        icon: 'network-wired',
        routerLink: '/genealogy',
      },
      {
        label: 'Group Maintain',
        icon: 'project-diagram',
        routerLink: '/group',
      },
    ];
  }

  ngOnInit(): void {
    this.setChangeBGInterval();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((account: Account | null) => {
        this.sessionStorageService.store('account', account);
        this.account = account;
      });
  }

  setChangeBGInterval(): void {
    const checkDiv = interval(100).subscribe(() => {
      const div = $('.home-content');
      if (div) {
        checkDiv.unsubscribe();
        $('.home-content').attr('style', 'background:' + (this.picGenerator.next().value as string));
        this.changeBackground = interval(6000).subscribe(() => {
          $('.home-content').attr('style', 'background:' + (this.picGenerator.next().value as string));
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  *genPic() {
    while (true) {
      for (const i of PIC) {
        yield i;
      }
    }
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.changeBackground?.unsubscribe();
    this.destroy$.complete();
  }
}
