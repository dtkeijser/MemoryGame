import { Component, OnInit } from '@angular/core';
import {GameService} from "../../service/game.service";

interface Theme {
  value: string;
  viewValue: string;
}

interface NumberOfPairs{
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent implements OnInit {

  selectedNumberOfPairs: number;
  selectedTheme: string;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  themes: Theme[] =[
    {value: 'Nature', viewValue: 'Nature'},
    {value: 'Winter', viewValue: 'Winter'},
  ];

  numberOfPairs: NumberOfPairs[] =[
    {value: 1, viewValue: 1},
    {value: 2, viewValue: 2},
    {value: 3, viewValue: 3},
    {value: 4, viewValue: 4},
    {value: 5, viewValue: 5},
    {value: 6, viewValue: 6},
    {value: 7, viewValue: 7},
    {value: 8, viewValue: 8},
    {value: 9, viewValue: 9},
    {value: 10, viewValue: 10}
  ]


  createGame(){
    console.log(this.selectedTheme)
    this.gameService.createGame(this.selectedTheme, this.selectedNumberOfPairs)
  }

}
