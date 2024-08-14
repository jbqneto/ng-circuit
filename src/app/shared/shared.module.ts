import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';

const sharedModules = [
  CommonModule,
  CardModule,
  MenubarModule
];

@NgModule({
  declarations: [],
  imports: sharedModules,
  exports: sharedModules
})
export class SharedModule { }
