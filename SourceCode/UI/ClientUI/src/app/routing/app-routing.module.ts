import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongDetail } from '../pages/song-detail.component';
import { HomePageComponent } from "../pages/home-page.component";
import { InitProfile } from '../pages/init-profile.component';

let routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'song/:songId', component: SongDetail },
    { path: 'init-profile', component: InitProfile }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }