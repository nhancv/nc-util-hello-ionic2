import {Page, NavController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Page({
    templateUrl: 'build/pages/hello-ionic/hello-ionic.html'
})
export class HelloIonicPage {

    static get parameters() {
        return [[NavController], [Http]];
    }

    constructor(nav, http) {
        this.nav = nav;
        this.http = http;
    }

    getMe() {
        console.log("getMe");
        var authHeader = new Headers();
        authHeader.append('Authorization', 'Basic ' + btoa("admin:District1"));

        this.http.get('https://play.dhis2.org/demo/api/me', {
                headers: authHeader
            })
            .map(res => {
                console.log(res);
                return res.statusText;
            })
            .subscribe(
                data => {
                    console.log(data);
                }, err => {
                    console.log(err);
                },
                () => {
                    console.log('Secret Quote Complete')
                }
            );
    }
}
