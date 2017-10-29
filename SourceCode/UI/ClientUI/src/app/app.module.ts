import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HttpConnector } from "./helper/http.connector";
import { SongService } from "./helper/services";
import { CustomFormsModule } from "./components/shared/forms/custom-forms.module";
import { AppRoutingModule } from "./routing/app-routing.module";
import { CommonSiteModule } from './components/common/common-site.module';
import { CarouselComponent } from "./components/shared/custom-design/carousel.component";
import { SongComponent } from "./components/shared/custom-design/song.component";
import { HomePageComponent } from "./pages/home-page.component";
import { LoginComponent } from "./pages/login.component";
import { CommonModule } from "@angular/common";
import { EllipsisPipe } from "./utilities/ellipsis-pipe";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    SongComponent,
    CarouselComponent,
    EllipsisPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CommonSiteModule,
    MaterialModule,
    CustomFormsModule,
  ],
  providers: [SongService, HttpConnector],
  bootstrap: [AppComponent]
})
export class AppModule { }
