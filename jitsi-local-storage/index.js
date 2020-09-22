import EventEmitter from 'events';

/**
 * Dummy implementation of Storage interface.
 */
class DummyLocalStorage extends EventEmitter {

    _storage = new Map();

    /**
     * Empties all keys out of the storage.
     *
     * @returns {void}
     */
    clear() {
        this._storage.clear();
    }

    /**
     * Returns the number of data items stored in the Storage object.
     *
     * @returns {number} - The number of data items stored in the Storage object.
     */
    get length() {
        return this._storage.size;
    }

    /**
     * Will return that key's value associated to the passed key name.
     *
     * @param {string} keyName - The key name.
     * @returns {*} - The key value.
     */
    getItem(keyName) {
        return this._storage.get(keyName);
    }

    /**
     * When passed a key name and value, will add that key to the storage,
     * or update that key's value if it already exists.
     *
     * @param {string} keyName - The key name.
     * @param {*} keyValue - The key value.
     * @returns {void}
     */
    setItem(keyName, keyValue) {
        this._storage.set(keyName, keyValue);
    }

    /**
     * When passed a key name, will remove that key from the storage.
     *
     * @param {string} keyName - The key name.
     * @returns {void}
     */
    removeItem(keyName) {
        this._storage.delete(keyName);
    }

    /**
     * When passed a number n, this method will return the name of the nth key in the storage.
     *
     * @param {number} idx - The index of the key.
     * @returns {string} - The nth key name.
     */
    key(n) {
        const iterator = this._storage.keys();
        let result = {};

        for (let i = 0; i <= n && result.done !== true; i++) {
            result = iterator.next();
        }

        return result.value;
    }
}

/**
 * Wrapper class for browser's local storage object.
 */
class JitsiLocalStorage extends EventEmitter {
    /**
     * @constructor
     * @param {Storage} storage browser's local storage object.
     */
    constructor() {
        super();

        try {
            this._storage = window.localStorage;
            this._localStorageDisabled = false;
        } catch (error) {
            console.warn('Local storage is disabled.');
            this._storage = new DummyLocalStorage();
            this._localStorageDisabled = true;
        }
    }

    /**
     * Returns true if window.localStorage is disabled and false otherwise.
     *
     * @returns {boolean} - True if window.localStorage is disabled and false otherwise.
     */
    isLocalStorageDisabled() {
        return this._localStorageDisabled;
    }

    /**
     * Empties all keys out of the storage.
     *
     * @returns {void}
     */
    clear() {
        this.emit('changed');
        this._storage.clear();
    }

    /**
     * Returns the number of data items stored in the Storage object.
     *
     * @returns {number} - The number of data items stored in the Storage object.
     */
    get length() {
        return this._storage.length;
    }

    /**
     * Returns that passed key's value.
     * @param {string} keyName the name of the key you want to retrieve
     * the value of.
     * @returns {String|null} the value of the key. If the key does not exist,
     * null is returned.
     */
    getItem(keyName) {
        return this._storage.getItem(keyName);
    }

    /**
     * Adds a key to the storage, or update key's value if it already exists.
     * @param {string} keyName - the name of the key you want to create/update.
     * @param {string} keyValue - the value you want to give the key you are
     * creating/updating.
     * @param {boolean} dontEmitChangedEvent - If true a changed event won't be emitted.
     */
    setItem(keyName, keyValue, dontEmitChangedEvent = false) {
        if (!dontEmitChangedEvent) {
            this.emit('changed');
        }

        return this._storage.setItem(keyName, keyValue);
    }

    /**
     * Remove a key from the storage.
     * @param {string} keyName the name of the key you want to remove.
     */
    removeItem(keyName) {
        this.emit('changed');

        return this._storage.removeItem(keyName);
    }

    /**
     * Returns the name of the nth key in the list, or null if n is greater
     * than or equal to the number of key/value pairs in the object.
     *
     * @param {number} i - The index of the key in the list.
     * @returns {string}
     */
    key(i) {
        return this._storage.key(i);
    }
}

export const jitsiLocalStorage = new JitsiLocalStorage();
