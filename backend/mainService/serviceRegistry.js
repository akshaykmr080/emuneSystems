'use strict';

class ServiceRegistry {

    constructor() {
        this._services = [];
        this._timeout = 30;
    }

    add(serviceName, ip, port) {
        const key = serviceName+ip+port;

        if(!this._services[key]) {
            this._services[key] = {};
            this._services[key].timestamp = Math.floor(new Date() / 1000);
            this._services[key].ip = ip;
            this._services[key].port = port;
            this._services[key].serviceName = serviceName;

            this._cleanup();
            return;
        }

        this._services[key].timestamp = Math.floor(new Date() / 1000);
        this._cleanup();
    }

    remove(serviceName, ip, port) {
        const key = serviceName + ip + port;
        delete this._services[key];
    }

    get(serviceName) {
        this._cleanup();
        for(let key in this._services) {
            if(this._services[key].serviceName == serviceName) return this._services[key];
        }
        return null;
    }

    _cleanup() {
        const now = Math.floor(new Date() / 1000);
        
        for(let key in this._services) {
            if(this._services[key].timestamp + this._timeout < now) {
                delete this._services[key];
            }
        }
    }

}

module.exports = ServiceRegistry;