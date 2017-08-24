import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService, UserService } from '../_services/index';

import { AuthService } from "angular2-social-login";

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    sub: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private _auth: AuthService,
        private userService: UserService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * Login
     */
    login() {
        this.loading = true;
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    /**
     * 
     * @param {any} provider
     */
    socialLogin(provider: string){
        this._auth.login(provider).subscribe(
            (data) => {
                if(data) {
                    var name = data['name'].split(' ');
                    this.model.email = data['email'];
                    this.model.firstName = name[0];
                    this.model.lastName = name[1];
                    
                    this.model.facebook = {
                        image: data['image'],
                        token: data['taken'],
                        id: data['uid']
                    } 
                    delete this.model.password;
                    this.authenticationService.socialLogin(this.model).subscribe(
                        data => {
                            this.router.navigate([this.returnUrl]);
                        },
                        error => {
                            this.alertService.error(error);
                            this.loading = false;
                    });
                }
            }
        )
    }
}
