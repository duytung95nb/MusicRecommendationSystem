import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { HomePageComponent } from "../pages/home-page.component";
import { LoginComponent } from "../pages/login.component";

let routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'home/:id', component: HomePageComponent},
    {path: 'login', component: LoginComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}