import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Game} from "../../model/Game";
import {Card} from "../../model/Card";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CardState} from "../../model/CardState";

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css'],
  animations: [
    trigger('cardFlip', [
      state(CardState.DEFAULT.toString(), style({
        transform: 'none',
      })),
      state(CardState.FLIPPED.toString(), style({
        transform: 'perspective(600px) rotateY(180deg)'
      })),
      state(CardState.MATCHED.toString(), style({
        visibility: 'false',
        transform: 'scale(0.05)',
        opacity: 0
      })),
      transition(CardState.DEFAULT.toString() + "=>" +  CardState.FLIPPED.toString() , [
        animate('400ms')
      ]),
      transition(CardState.FLIPPED.toString() + "=>" + CardState.DEFAULT.toString(), [
        animate('400ms')
      ]),
      transition('* =>' + CardState.MATCHED.toString(), [
        animate('400ms')
      ])
    ])
  ]
})
export class GameCardComponent implements OnInit {

  @Input() card: Card;
  @Output() cardClicked = new EventEmitter();
  constructor(public game: Game) { }

  ngOnInit(): void {
  }

}
