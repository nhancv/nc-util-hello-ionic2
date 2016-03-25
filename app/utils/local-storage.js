var LocalStorage = (function () {
    function LocalStorage() {
        if (!localStorage) {
            throw new Error('Current browser does not support Local Storage');
        }
        this.localStorage = localStorage;
    }

    LocalStorage.prototype.set = function (key, value) {
        this.localStorage[key] = value;
    };
    LocalStorage.prototype.get = function (key) {
        return this.localStorage[key] || false;
    };
    LocalStorage.prototype.setObject = function (key, value) {
        this.localStorage[key] = JSON.stringify(value);
    };
    LocalStorage.prototype.getObject = function (key) {
        return JSON.parse(this.localStorage[key] || '{}');
    };
    LocalStorage.prototype.remove = function (key) {
        this.localStorage.removeItem(key);
    };
    LocalStorage.prototype.clearAll = function () {
        this.localStorage.clear();
    };
    return LocalStorage;
})();
exports.LocalStorage = LocalStorage;