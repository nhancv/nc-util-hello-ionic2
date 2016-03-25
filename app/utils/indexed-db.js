var IndexedDB = (function () {
    function IndexedDB(dbName, version) {
        this.utils = new Utils();
        this.dbWrapper = new DbWrapper(dbName, version);
    }

    /**
     * Create store, this function must be call and finished firstly
     * @param version
     * @param upgradeCallback
     * @returns {Promise|any}
     */
    IndexedDB.prototype.createStore = function (version, upgradeCallback) {
        var _this = this;
        var self = this, promise = new Promise(function (resolve, reject) {
            _this.dbWrapper.dbVersion = version;
            var request = _this.utils.indexedDB.open(_this.dbWrapper.dbName, version);
            request.onsuccess = function (e) {
                self.dbWrapper.db = request.result;
                resolve();
            };
            request.onerror = function (e) {
                reject("IndexedDB error: " + e.target.errorCode);
            };
            request.onupgradeneeded = function (e) {
                upgradeCallback(e, self.dbWrapper.db);
            };
        });
        return promise;
    };
    /**
     * Get object of store by key
     * @param storeName
     * @param key
     * @returns {Promise|any}
     */
    IndexedDB.prototype.getByKey = function (storeName, key) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readonly,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve(result);
                }
            }), objectStore = transaction.objectStore(storeName), result, request;
            request = objectStore.get(key);
            request.onsuccess = function (event) {
                result = event.target.result;
            };
        });
        return promise;
    };
    /**
     * Get all objects of store
     * @param storeName
     * @returns {Promise|any}
     */
    IndexedDB.prototype.getAll = function (storeName) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readonly,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve(result);
                }
            }), objectStore = transaction.objectStore(storeName), result = [], request = objectStore.openCursor();
            request.onerror = function (e) {
                reject(e);
            };
            request.onsuccess = function (evt) {
                var cursor = evt.target.result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor["continue"]();
                }
            };
        });
        return promise;
    };
    /**
     * Add new object to store if key does not exist otherwise throw error
     * @param storeName
     * @param value
     * @param key
     * @returns {Promise|any}
     */
    IndexedDB.prototype.add = function (storeName, value, key) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readwrite,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve({key: key, value: value});
                }
            }), objectStore = transaction.objectStore(storeName);
            objectStore.add(value, key);
        });
        return promise;
    };

    /**
     * Update store if key had existed otherwise insert obj to store. If key is main key or index, it can't be updated.
     * @param storeName
     * @param value
     * @param key
     * @returns {Promise|any}
     */
    IndexedDB.prototype.upsert = function (storeName, value, key) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readwrite,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve(value);
                },
                abort: function (e) {
                    reject(e);
                }
            }), objectStore = transaction.objectStore(storeName);
            objectStore.put(value, key);
        });
        return promise;
    };
    IndexedDB.prototype.delete = function (storeName, key) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readwrite,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve();
                },
                abort: function (e) {
                    reject(e);
                }
            }), objectStore = transaction.objectStore(storeName);
            objectStore["delete"](key);
        });
        return promise;
    };
    IndexedDB.prototype.openCursor = function (storeName, cursorCallback) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readonly,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve();
                },
                abort: function (e) {
                    reject(e);
                }
            }), objectStore = transaction.objectStore(storeName), request = objectStore.openCursor();
            request.onsuccess = function (evt) {
                cursorCallback(evt);
                resolve();
            };
        });
        return promise;
    };
    /**
     * Clear all object of Store
     * @param storeName
     * @returns {Promise|any}
     */
    IndexedDB.prototype.clear = function (storeName) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readwrite,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve();
                },
                abort: function (e) {
                    reject(e);
                }
            }), objectStore = transaction.objectStore(storeName);
            objectStore.clear();
            resolve();
        });
        return promise;
    };
    IndexedDB.prototype.getByIndex = function (storeName, indexName, key) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            self.dbWrapper.validateBeforeTransaction(storeName, reject);
            var transaction = self.dbWrapper.createTransaction({
                storeName: storeName,
                dbMode: self.utils.dbMode.readonly,
                error: function (e) {
                    reject(e);
                },
                complete: function (e) {
                    resolve(result);
                },
                abort: function (e) {
                    reject(e);
                }
            }), result, objectStore = transaction.objectStore(storeName), index = objectStore.index(indexName), request = index.get(key);
            request.onsuccess = function (event) {
                result = event.target.result;
            };
        });
        return promise;
    };
    return IndexedDB;
})();
exports.IndexedDB = IndexedDB;
var Utils = (function () {
    function Utils() {
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        this.dbMode = {
            readonly: "readonly",
            readwrite: "readwrite"
        };
    }

    return Utils;
})();
var DbWrapper = (function () {
    function DbWrapper(dbName, version) {
        this.dbName = dbName;
        this.dbVersion = version || 1;
        this.db = null;
        this.storeNames = [];
    }

    DbWrapper.prototype.validateStoreName = function (storeName) {
        return this.db.objectStoreNames.contains(storeName);
    };
    ;
    DbWrapper.prototype.validateBeforeTransaction = function (storeName, reject) {
        if (!this.db) {
            reject('You need to use the createStore function to create a database before you query it!');
        }
        if (!this.validateStoreName(storeName)) {
            reject(('objectStore does not exists: ' + storeName));
        }
    };
    DbWrapper.prototype.createTransaction = function (options) {
        var trans = this.db.transaction(options.storeName, options.dbMode);
        trans.onerror = options.error;
        trans.oncomplete = options.complete;
        trans.onabort = options.abort;
        return trans;
    };
    return DbWrapper;
})();
//# sourceMappingURL=indexedDb.js.map