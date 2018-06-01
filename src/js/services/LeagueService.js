import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import mfgFetch from './mfgFetch';

let instance;

class LeagueService {

  @observable myLeagues = [];
  @observable selectedLeague = {};
  @observable myroster = [];
  @observable myInvites = [];

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  isCommisioner(userId) {
    return this.selectedLeague.commissioner.id === userId;
  }

  async createLeague(league) {
    await mfgFetch('/api/league',
      { method: 'POST', body: JSON.stringify(league)});
    await this.loadMyLeagues();
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
  async refreshSelectedLeague() {
    const league = await mfgFetch(`/api/league/${this.selectedLeague._id}`,
      { method: 'GET'});

    this.selectedLeague = league.league;
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

  @action
  async loadMyInvites() {
    const invites = await mfgFetch('/api/invites', {method: 'GET'});
    this.myInvites = invites.leagues;
  }

  @action
  async acceptInvitation(invitation, teamName) {
    await mfgFetch(`/api/invite/accept/${invitation._id}/${teamName}`,
      {
        method: 'PUT'
      });

    await this.loadMyInvites();
    await this.loadMyLeagues();
  }

  @action
  async declineInvitation(invitation) {
    await mfgFetch(`/api/invite/decline/${invitation._id}`,
      {
        method: 'DELETE'
      });

    await this.loadMyInvites();
    await this.loadMyLeagues();
  }
}

export default LeagueService;
