import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import mfgFetch from './mfgFetch';

let instance;

class LeagueService {

  @observable myLeagues = [];
  @observable selectedLeague = undefined;
  @observable availablePlayers = [];

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  @action
  selectLeague(league) {

    if (isString(league)) {
      this.selectedLeague = this.myLeagues.find( (realLeague) => {
        return realLeague._id === league;
      });
    }
    else {
      this.selectedLeague = league;
    }
  }

  @action
  async loadMyLeagues() {
    const leagues = await mfgFetch('/api/myleagues', { method: 'GET' });
    this.myLeagues = leagues.leagues;
  }

  async getAvailablePlayers() {

    if (isNil(this.selectedLeague)) {
      return this.availablePlayers;
    }

    if (isNil(this.availablePlayers) || this.availablePlayers.length === 0 ) {
      const response =
        //eslint-disable-next-line
        await mfgFetch(`/api/league/${this.selectedLeague._id}/availablePlayers`,
          {method: 'GET'});

      this.availablePlayers = response.players;
    }

    return this.availablePlayers;
  }
}

export default LeagueService;
