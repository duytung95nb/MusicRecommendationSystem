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
import { SongDetail } from './pages/song-detail.component';
import { MaterialModule } from './material.module';
import { StarRatingModule } from 'angular-star-rating';
import { UserService } from './helper/userService';
import { StoreModule } from '@ngrx/store';
import { userReducer, AppState } from './reducers/userReducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './effects/userEffect';
import {StoreDevtoolsModule } from '@ngrx/store-devtools';
import { User } from './objects/user';
import { ServiceModule } from './helper/serviceModule';
import { FacebookModule } from 'ngx-facebook';
import {Angular2SocialLoginModule} from 'angular2-social-login';
import { InitProfile } from './pages/init-profile.component';

let providers = {
  "google": {
    "clientId": "GOOGLE_CLIENT_ID"
  },
  "linkedin": {
    "clientId": "LINKEDIN_CLIENT_ID"
  },
  "facebook": {
    "clientId": "FACEBOOK_CLIENT_ID",
    "apiVersion": "2.11" //like v2.4 
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SongDetail,
    InitProfile
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    CommonSiteModule,
    SharedModule,
    MaterialModule,
    StarRatingModule.forRoot(),
    Angular2SocialLoginModule,
    ServiceModule,
    StoreModule.forRoot({ root: userReducer}),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([
      UserEffects
    ]),
    FacebookModule.forRoot(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);