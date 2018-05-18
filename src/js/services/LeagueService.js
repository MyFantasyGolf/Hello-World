import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import mfgFetch from './mfgFetch';

let instance;

class LeagueService {

  @observable myLeagues = [];
  @observable selectedLeague = {};
  @observable myroster = [];

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  isCommisioner(userId) {
    const user = this.selectedLeague.manager.find( (manager) => {
      return manager === userId;
    });

    return !isNil(user);
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

  getTeamNameFromIdForSelectedLeague = (leagueId, teamId) => {

    return this.selectedLeague.teams.find( (team) => {
      return team.user === teamId;
    });
  }

  @action
  async loadMyLeagues() {
    const leagues = await mfgFetch('/api/myleagues', { method: 'GET' });
    this.myLeagues = leagues.leagues;
  }
}

export default LeagueService;
