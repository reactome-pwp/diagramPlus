import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import {HttpClientModule} from "@angular/common/http";




@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
