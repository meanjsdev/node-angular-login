import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { customHttpProvider } from './_helpers/index';
import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { ForgotpasswordComponent } from './forgotpassword/index';
import { ResetpasswordComponent } from './resetpassword/index';

import { Angular2SocialLoginModule } from "angular2-social-login";

let providers = {
    // "google": {
    //   "clientId": "GOOGLE_CLIENT_ID"
    // },
    // "linkedin": {
    //   "clientId": "LINKEDIN_CLIENT_ID"
    // },
    "facebook": {
      "clientId": "234514923738463",
      "apiVersion": "v2.4" //like v2.4 
    }
  };

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        Angular2SocialLoginModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ForgotpasswordComponent,
        ResetpasswordComponent
    ],
    providers: [
        customHttpProvider,
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);