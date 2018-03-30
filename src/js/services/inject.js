import React from 'react';
import ServiceRegistry from './ServiceRegistry';

const inject = (...serviceNames) => {

  const services = {};

  serviceNames.forEach( (serviceName) => {
    services[serviceName] = ServiceRegistry.getService(serviceName);
  });

  return (Component) => {
    return class ServiceProviderComponent extends React.Component {
      render() {
        return <Component {...this.props} {...services}></Component>;
      }
    };
  };
};

export default inject;
