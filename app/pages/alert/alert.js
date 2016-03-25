import {Page, Alert, ActionSheet, NavController} from 'ionic-angular';
import {LocalStorage} from '../../utils/local-storage';
import {IndexedDB} from '../../utils/indexed-db';
@Page({
    templateUrl: 'build/pages/alert/alert.html'
})
export class AlertPage {
    static get parameters() {
        return [[NavController]];
    }

    constructor(nav) {
        this.nav = nav;
        var test = new LocalStorage();
        test.set("test", "test");
        test.clearAll();

        let db = new IndexedDB('myDb', 1);
        db.createStore(1, (evt) => {
            let objectStore = evt.currentTarget.result.createObjectStore(
                'people', {keyPath: "id", autoIncrement: true});

            //objectStore.createIndex("name", "name", {unique: false});
            //objectStore.createIndex("email", "email", {unique: true});
        }).then(()=> {

            db.add('people', {id: 1, name: 'nhan1', email: 'email1'}).then(() => {
                // Do something after the value was added
                console.log("add1");
            }, (error) => {
                console.log("add1 err");
                console.log(error);
            });

            db.upsert('people', {id: 2, name: 'nhan2', email: 'email2'}).then(() => {
                // Do something after the value was added
                console.log("update/insert");
            }, (error) => {
                console.log("update/insert err");
                console.log(error);
            });
            db.getByKey('people', 1).then((person) => {
                console.log(person);
            }, (error) => {
                console.log(error);
            });
            db.getAll('people').then((person) => {
                console.log(person);
            }, (error) => {
                console.log(error);
            });
        });


    }

    showAlert() {
        let alert = Alert.create({
            title: 'New Friend!',
            subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
            buttons: ['Ok']
        });
        this.nav.present(alert);
    }

    actionSheet() {
        let actionSheet = ActionSheet.create({
            title: 'Modify your album',
            buttons: [
                {
                    text: 'Destructive',
                    style: 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                }, {
                    text: 'Archive',
                    handler: () => {
                        console.log('Archive clicked');
                    }
                }, {
                    text: 'Cancel',
                    style: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.nav.present(actionSheet);
    }
}
