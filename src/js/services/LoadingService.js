import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';

import mfgFetch from './mfgFetch';

let instance;

class LoadingService {

  @observable loadingStates = {};
  @observable loading = false;

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  @action
  startLoading(key) {
    this.loadingStates[key] = true;
    this.loading = this.isLoading();
  }

  @action
  stopLoading(key) {
    this.loadingStates[key] = false;
    this.loading = this.isLoading();
  }

  isLoading() {
    const stillLoading = Object.keys(this.loadingStates).filter( (key) => {
      return this.loadingStates[key];
    });

    return stillLoading.length > 0;
  }

  async isUpdating() {
    const isIt = await mfgFetch('/api/isUpdating', {method: 'GET'});
    return isIt.updating;
  }
}

export default LoadingService;
