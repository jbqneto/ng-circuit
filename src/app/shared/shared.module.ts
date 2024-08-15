import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { MenubarModule } from 'primeng/menubar';
import { OrderListModule } from 'primeng/orderlist';

const sharedModules = [
  CommonModule,
  FormsModule,
  CardModule,
  MenubarModule,
  ButtonModule,
  ChartModule,
  OrderListModule
];

@NgModule({
  declarations: [],
  imports: sharedModules,
  exports: sharedModules
})
export class SharedModule { }
