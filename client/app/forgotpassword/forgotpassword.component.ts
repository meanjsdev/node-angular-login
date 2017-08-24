import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'forgotpassword.component.html'
})

export class ForgotpasswordComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    /**
     * Register User
     */
    forgotpassword() {
        this.loading = true;
        this.userService.forgotpassword(this.model)
            .subscribe(
                data => {
                    this.alertService.success(data.message, true);
                    this.loading = false;
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
