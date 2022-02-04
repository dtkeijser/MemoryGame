import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameSetupComponent } from './component/game-setup/game-setup.component';
import {GameService} from "./service/game.service";
import {HttpClientModule} from "@angular/common/http";
import { GameLobbyComponent } from './component/game-lobby/game-lobby.component';
import { HeaderComponent } from './component/header/header.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { HomePageComponent } from './component/home-page/home-page.component';
import { GameComponent } from './component/game/game.component';
import { GameCardComponent } from './component/game-card/game-card.component';
import {FormsModule} from "@angular/forms";
import {SessionService} from "./service/session.service";

@NgModule({
  declarations: [
    AppComponent,
    GameSetupComponent,
    GameLobbyComponent,
    HeaderComponent,
    NavBarComponent,
    HomePageComponent,
    GameComponent,
    GameCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [GameService, SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
