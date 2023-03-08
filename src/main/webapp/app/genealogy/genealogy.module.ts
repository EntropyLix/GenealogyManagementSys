import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { GenealogyComponent } from './genealogy.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { GENEALOGY_ROUTE } from './genealogy.route';
import { ToastModule } from 'primeng/toast';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { SpeedDialModule } from 'primeng/speeddial';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as networkgraph from 'highcharts/modules/networkgraph.src';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';

@NgModule({
  declarations: [GenealogyComponent],
  imports: [
    SharedModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DropdownModule,
    TableModule,
    SpeedDialModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    DialogModule,
    CardModule,
    SidebarModule,
    VirtualScrollerModule,
    FormsModule,
    ChartModule,
    RouterModule.forChild([GENEALOGY_ROUTE]),
  ],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: () => [more, exporting, networkgraph] }],
})
export class GenealogyModule {}
