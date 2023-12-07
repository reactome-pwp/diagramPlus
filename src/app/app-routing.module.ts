import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {DiagramComponent} from "./diagram/diagram.component";


const routes: Routes = [
  { path: '', redirectTo: '/diagram/8851680', pathMatch: 'full' },
  { path: 'diagram/:id', component: DiagramComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
