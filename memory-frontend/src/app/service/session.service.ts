import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private sessionUsername: string

  constructor() { }


  setUsernameForSession(sessionUsername){
    this.sessionUsername = sessionUsername
  }

  getSessionUsername(){
    return this.sessionUsername
  }



}
