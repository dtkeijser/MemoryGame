import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from "../../service/game.service";
import {GameSummary} from "../../model/GameSummary";
import {interval, Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-game-lobby',
  templateUrl: './game-lobby.component.html',
  styleUrls: ['./game-lobby.component.css']
})
export class GameLobbyComponent implements OnInit, OnDestroy {

  public pendingGameSummaries: Observable<Array<GameSummary>>
  public ownGameSummaries: Observable<Array<GameSummary>>
  intervals =[]

  constructor( public gameService: GameService,
               private router: Router) { }


  ngOnInit(): void {
    this.pendingGameSummaries = new Observable<Array<GameSummary>>(subscriber => {
      this.refreshOtherGames(subscriber)
      this.intervals.push( setInterval(()=> {
        this.refreshOtherGames(subscriber)
      }, 5000))
    })

    this.ownGameSummaries = new Observable<Array<GameSummary>>(subscriber => {
      this.refreshOwnGames(subscriber)
      this.intervals.push(setInterval(()=> {
        this.refreshOwnGames(subscriber)
      }, 5000))
    })
  }

  refreshOtherGames(subscriber){
    this.gameService.findPendingGameSummariesFromOtherUsers().toPromise().then((gameSummaries) =>
      subscriber.next(gameSummaries)
    )
  }
  refreshOwnGames(subscriber){
    this.gameService.findOwnGameSummaries().toPromise().then((gameSummaries) =>{
     subscriber.next(gameSummaries)
    })
  }

  onClickJoinButton(id){
    this.gameService.joinGame(id).then(() => {
      this.router.navigate(['/game/' + id])
      }
    )
  }

  onClickRejoinButton(id){
    this.router.navigate(['/game/' + id])
  }

  ngOnDestroy(): void {
    this.intervals.forEach(interval =>{
      clearInterval(interval)
    })
  }
}
