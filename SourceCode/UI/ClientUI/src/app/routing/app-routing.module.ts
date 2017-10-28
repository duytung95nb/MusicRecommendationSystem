import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongDetail } from '../pages/song-detail.component';
import { HomePageComponent } from "../pages/home-page.component";

let routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'song/:songId', component: SongDetail }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }