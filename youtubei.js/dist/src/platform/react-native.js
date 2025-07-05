var _Cache_instances, _Cache_persistent_directory, _Cache_persistent, _Cache_getStorage;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { Platform } from '../utils/Utils.js';
import sha1Hash from './polyfills/web-crypto.js';
import package_json from '../../package.json' assert { type: 'json' };
import evaluate from './jsruntime/jinter.js';
class Cache {
    constructor(persistent = false, persistent_directory) {
        _Cache_instances.add(this);
        _Cache_persistent_directory.set(this, void 0);
        _Cache_persistent.set(this, void 0);
        __classPrivateFieldSet(this, _Cache_persistent_directory, persistent_directory || '', "f");
        __classPrivateFieldSet(this, _Cache_persistent, persistent, "f");
    }
    get cache_dir() {
        return __classPrivateFieldGet(this, _Cache_persistent, "f") ? __classPrivateFieldGet(this, _Cache_persistent_directory, "f") : '';
    }
    async get(key) {
        const storage = __classPrivateFieldGet(this, _Cache_instances, "m", _Cache_getStorage).call(this);
        return storage.getBuffer(key)?.buffer;
    }
    async set(key, value) {
        const storage = __classPrivateFieldGet(this, _Cache_instances, "m", _Cache_getStorage).call(this);
        storage.set(key, new Uint8Array(value));
    }
    async remove(key) {
        const storage = __classPrivateFieldGet(this, _Cache_instances, "m", _Cache_getStorage).call(this);
        storage.delete(key);
    }
}
_Cache_persistent_directory = new WeakMap(), _Cache_persistent = new WeakMap(), _Cache_instances = new WeakSet(), _Cache_getStorage = function _Cache_getStorage() {
    const storage = new globalThis.mmkvStorage({ id: 'InnertubeCache' });
    return storage;
};
Platform.load({
    runtime: 'react-native',
    server: false,
    info: {
        version: package_json.version,
        bugs_url: package_json.bugs.url,
        repo_url: package_json.homepage.split('#')[0]
    },
    Cache: Cache,
    sha1Hash,
    uuidv4() {
        if (globalThis.crypto?.randomUUID()) {
            return globalThis.crypto.randomUUID();
        }
        // See https://stackoverflow.com/a/2117523
        return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (cc) => {
            const c = parseInt(cc);
            return (c ^
                (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
        });
    },
    eval: evaluate,
    fetch: globalThis.fetch,
    Request: globalThis.Request,
    Response: globalThis.Response,
    Headers: globalThis.Headers,
    FormData: globalThis.FormData,
    File: globalThis.File,
    ReadableStream: globalThis.ReadableStream,
    CustomEvent: globalThis.CustomEvent
});
export * from './lib.js';
import Innertube from './lib.js';
export default Innertube;
//# sourceMappingURL=react-native.js.map