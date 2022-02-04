import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameSetupComponent} from "./component/game-setup/game-setup.component";
import {HomePageComponent} from "./component/home-page/home-page.component";
import {GameLobbyComponent} from "./component/game-lobby/game-lobby.component";
import {GameComponent} from "./component/game/game.component";

const routes: Routes = [
  // Main page
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomePageComponent},
  //GamePages
  {path: 'gameLobby', component: GameLobbyComponent},
  {path: 'gameSetup', component: GameSetupComponent},
  {path: 'game/:id', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
