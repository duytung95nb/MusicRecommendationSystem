import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HttpConnector } from "./helper/http.connector";
import { SongService } from "./helper/services";
import { AppRoutingModule } from "./routing/app-routing.module";
import { CommonSiteModule } from './components/common/common-site.module';
import { HomePageComponent } from "./pages/home-page.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from './components/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CommonSiteModule,
    SharedModule
  ],
  providers: [SongService, HttpConnector],
  bootstrap: [AppComponent]
})
export class AppModule { }
