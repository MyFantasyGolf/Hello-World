import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import mfgFetch from './mfgFetch';

let instance;

class LeagueService {

  @observable myLeagues = [];
  @observable selectedLeague = undefined;
  @observable availablePlayers = undefined;
  @observable myDraftList = undefined;

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

  @action
  async getAvailablePlayers() {

    if (isNil(this.selectedLeague)) {
      return this.availablePlayers;
    }

    if (isNil(this.availablePlayers)) {
      const response =
        //eslint-disable-next-line
        await mfgFetch(`/api/league/${this.selectedLeague._id}/availablePlayers`,
          {method: 'GET'});

      this.availablePlayers = response.players;
    }

    return this.availablePlayers;
  }

  @action
  async getMyDraftList(force = false) {
    if (isNil(this.selectedLeague)) {
      return this.myDraftList;
    }

    if (!isNil(this.myDraftList) && force !== true) {
      return this.myDraftList;
    }

    const response =
      await mfgFetch(`/api/league/${this.selectedLeague._id}/draftList`,
        { method: 'GET' });

    this.myDraftList = response.players;
    return this.myDraftList;
  }

  @action
  async addPlayerToMyList(player, index = 0) {
    this.myDraftList.splice(index, 0, player);

    await mfgFetch(`/api/league/${this.selectedLeague._id}/draftList`,
      {
        method: 'PUT',
        body: JSON.stringify({
          draftList: this.myDraftList
        })
      });

    this.getMyDraftList(true);
  }

  @action
  async removePlayerFromMyList(player) {
    const index = this.myDraftList.findIndex( (dPlayer) => {
      return player.key === dPlayer.key;
    });

    if (index === -1) {
      return;
    }

    this.myDraftList.splice(index, 1);

    await mfgFetch(`/api/league/${this.selectedLeague._id}/draftList`,
      {
        method: 'PUT',
        body: JSON.stringify({
          draftList: this.myDraftList
        })
      });

    this.getMyDraftList(true);
  }
}

export default LeagueService;
