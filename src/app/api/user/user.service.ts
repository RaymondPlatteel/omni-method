import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../store/user/user.model';
import { IUserService } from './user.service.interface';
import { environment } from 'src/environments/environment';
import { Score } from '../../store/models/score.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as UserActions from '../../store/user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class UserService implements IUserService {
  private _currentUser: User = null;
  private newScore = new Subject<Score>();

  constructor(private http: HttpClient, private store: Store<AppState>) {}

  load() {
    this.store.dispatch(UserActions.loadUserAction());
  }

  getUser(id: string): Observable<User> {
    console.log('GET ' + environment.baseUrl + '/users/' + id);
    return this.http.get<User>(environment.baseUrl + '/users/' + id).pipe(
      map((user) => {
        this._currentUser = user;
        return user;
      })
    );
  }

  setUser(user: User): Observable<User> {
    console.log('add new user');
    this._currentUser = user;
    return this.http
      .post<User>(environment.baseUrl + `/users`, user)
      .pipe(catchError(this.handleError));
  }

  setCurrentUser(user: User) {
    this._currentUser = user;
  }

  getCurrentUser(): User {
    return this._currentUser;
  }

  onNewScore(): Observable<Score> {
    return this.newScore.asObservable();
  }

  saveScore(score: Score) {
    console.log('user.service.saveScore ' + JSON.stringify(score));
    // this.newScore.next(score);
    return this.http
      .post<Score>(environment.baseUrl + `/users/${score.uid}/scores`, score)
      .pipe(catchError(this.handleError))
      .pipe(
        tap((m) => {
          this.newScore.next(m);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
