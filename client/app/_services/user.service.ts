import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    /**
     * Get all User
     */
    getAll() {
        return this.http.get('/users').map((response: Response) => response.json());
    }

    /**
     * Get user by Id
     * @param {string} _id [description]
     */
    getById(_id: string) {
        return this.http.get('/users/' + _id).map((response: Response) => response.json());
    }

    /**
     * Create a user
     * @param {User} user [description]
     */
    create(user: User) {
        return this.http.post('/users/register', user);
    }

    /**
     * Update a user
     * @param {User} user [description]
     */
    update(user: User) {
        return this.http.put('/users/' + user._id, user);
    }

    /**
     * Delete a user
     * @param {string} _id [description]
     */
    delete(_id: string) {
        return this.http.delete('/users/' + _id);
    }

    /**
     * Forgot password, Sends an email
     * @param {string} _id [description]
     */
    forgotpassword(user: User) {
        return this.http.post('/users/forgot-password', user).map((response: Response) => response.json());
    }

    /**
     * Reset password 
     * @param {string} _id [description]
     */
    resetpassword(user: User) {
        return this.http.post('/users/reset-password', user).map((response: Response) => response.json());
    }
}