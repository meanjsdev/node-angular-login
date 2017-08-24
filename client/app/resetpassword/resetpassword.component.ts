import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'resetpassword.component.html'
})

export class ResetpasswordComponent implements OnInit {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        // subscribe to router event and get query params
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.model.email = params['email'];
            this.model.token = params['token'];
        });
    }

    /**
     * Register User
     */
    resetPassword() {
        this.loading = true;

        this.userService.resetpassword(this.model)
            .subscribe(
                data => {
                    this.loading = false;
                    this.alertService.success(data.message, true);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
