import {importProvidersFrom, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PdfComponent } from './pdf/pdf.component';
import {HttpClientModule} from "@angular/common/http";
import {PdfService} from "./pdf/pdf.service";
import {ImageSchema} from "../graphics/image";
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    PdfComponent,
    PdfViewerComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    importProvidersFrom(HttpClientModule),
    PdfService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
