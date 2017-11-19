import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SongService } from './services';
import { HttpConnector } from './http.connector';
import { UserService } from './userService';
import { UserEventService } from './userEventService';

@NgModule({
    imports: [UserEventService, SongService, HttpConnector, UserService],
    providers: [UserEventService, SongService, HttpConnector, UserService]
})
export class ServiceModule { }
