import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  constructor() {}

  userLoggedIn(): boolean {
    return this.userLoggedInSubject.value;
  }

  userRole(): string | null {
    return this.userRoleSubject.value;
  }

  login(role: string): void {
    this.userLoggedInSubject.next(true);
    this.userRoleSubject.next(role);
  }

  logout(): void {
    this.userLoggedInSubject.next(false);
    this.userRoleSubject.next(null);
  }
}
