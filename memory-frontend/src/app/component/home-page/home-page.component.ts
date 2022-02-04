import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {SessionService} from "../../service/session.service";
import {GameService} from "../../service/game.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private router: Router,
              public sessionService: SessionService,
              public gameService: GameService) { }

  ngOnInit(): void {
  }

  onNewGameClick(): void {
    this.router.navigate(['/game']);
  }

  async onClickCreateTestGame(){
    this.sessionService.setUsernameForSession("DTK")
    let id = await this.gameService.createGame("winter", 4)
    this.sessionService.setUsernameForSession("Daniel")
    await this.gameService.joinGame(id)
    this.sessionService.setUsernameForSession("DTK")
    await this.router.navigate(['/game/' + id])
  }

  async onClickRejoinGameAsDaniel(){
    this.sessionService.setUsernameForSession("Daniel")
    let id = await this.gameService.findOwnGameSummaries().toPromise().then(x =>{
      return x[x.length -1]["id"]
    })
    await this.router.navigate(['/game/' + id])
  }
}
