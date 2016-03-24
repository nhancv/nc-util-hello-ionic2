# hello-ionic2

Documents of ionic2: http://ionicframework.com/docs/v2/

Documents of angular2: https://angular.io/

```python
$ npm install -g ionic@beta

$ ionic start hello-ionic2 tutorial --v2
$ cd MyIonic2Project/
$ ionic serve
```

Building to a Device:
```python
$ sudo npm install -g cordova
```
Building for iOS
```python
$ ionic platform add ios
$ ionic emulate ios
```
Building for Android
```python
$ ionic platform add android
$ ionic run android
```
---

First build when checkout finished
```python
$ npm install
$ ionic serve
```

Integrate Cordova Crosswalk plugin
```python
$ ionic platform add android
$ ionic plugin add cordova-plugin-crosswalk-webview
$ ionic build android

Once build successful let you check apk file in:
hello-ionic2/platforms/android/build/outputs/apk
android-armv7-debug-unaligned.apk
android-armv7-debug.apk
android-x86-debug-unaligned.apk
android-x86-debug.apk
```

