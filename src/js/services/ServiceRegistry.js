import isNil from 'lodash/isNil';

let instance;

class ServiceRegistry {

  constructor() {
    if (isNil(instance)) {
      instance = this;
      instance._services = {};
    }

    return instance;
  }

  register(...services) {
    services.filter( (service) => {
      if (isNil(this._services[service.name])) {
        return true;
      }
    }).forEach( (service) => {
      // eslint-disable-next-line new-cap
      this._services[service.name] = new service();
    });
  }

  removeAll() {
    Object.keys(this._services).forEach( (key) => {
      delete this._services[key];
    });
  }

  unregister(...serviceNames) {

    serviceNames.forEach( (serviceName) => {
      delete this._services[serviceName];
    });
  }

  getService(serviceName) {
    return this._services[serviceName];
  }
}

const reg = new ServiceRegistry();

export default reg;
