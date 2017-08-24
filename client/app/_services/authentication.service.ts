import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { User } from '../_models/index';
@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    /**
     * Login
     * @param {string} email    
     * @param {string} password 
     */
    login(email: string, password: string) {
        return this.http.post('/users/authenticate', { email: email, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });
    }

    socialLogin(user: User) {
        return this.http.post('/users/social-authenticate', user)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            });
    }

    /**
     * Logout
     */
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}