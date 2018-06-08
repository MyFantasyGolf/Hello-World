import { observable, action } from 'mobx';
import mfgFetch from './mfgFetch';
import isNil from 'lodash/isNil';

let instance;

class StatService {

  @observable schedule;

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  @action
  async getSchedule(force = false) {

    if (!isNil(this.schedule) && force !== true) {
      return this.schedule;
    }

    const response = await mfgFetch('/api/schedule', { method: 'GET' });

    this.schedule = response.schedule;
    return this.schedule;
  }
}

export default StatService;
