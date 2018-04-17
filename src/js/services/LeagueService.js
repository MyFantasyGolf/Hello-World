import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import mfgFetch from './mfgFetch';

let instance;

class LeagueService {

  @observable myLeagues = [];
  @observable selectedLeague = undefined;

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  @action
  selectLeague(league) {
    this.selectedLeague = league;
  }

  @action
  async loadMyLeagues() {
    const leagues = await mfgFetch('/api/myleagues', { method: 'GET' });

    this.myLeagues = leagues;
  }
}

export default LeagueService;
