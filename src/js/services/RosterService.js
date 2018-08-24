import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import mfgFetch from './mfgFetch';
import ServiceRegistry from './ServiceRegistry';

let instance;

class RosterService {

  @observable availablePlayers = undefined;
  @observable myDraftList = undefined;
  @observable draft = undefined;
  @observable draftStatus = undefined;
  @observable activeRosterMap = undefined;

  playerCache = {};

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  async getGolfer(key) {
    const cachedPlayer = this.playerCache[key];

    if (!isNil(cachedPlayer)) {
      return cachedPlayer;
    }

    const player = await mfgFetch(`/api/golfer/${key}`, {method: 'GET'});

    this.playerCache[key] = player;
    return player;
  }

  async getRoster(leagueId, teamId) {
    const leagueService = ServiceRegistry.getService('LeagueService');

    if (isNil(leagueService.selectedLeague) ||
      isNil(leagueService.selectedLeague.teams)) {
      return [];
    }

    await leagueService.refreshSelectedLeague();

    return leagueService.selectedLeague.teams.find( (team) => {
      return team.user === teamId;
    });
  }

  async getMyActiveRosterMap(leagueId, force = false) {

    if (!isNil(this.activeRosterMap) && force !== true) {
      return this.activeRosterMap;
    }

    const response = await mfgFetch(`/api/league/${leagueId}/myActiveRoster`,
      { method: 'GET'});

    this.activeRosterMap = response.map;
    return this.activeRosterMap;
  }

  @action
  async setActiveRoster(leagueId, map) {

    await mfgFetch(`/api/league/${leagueId}/setActiveRoster`,
      {
        method: 'PUT',
        body: JSON.stringify(map)
      });

    this.activeRosterMap = map;
    return map;
  }

  @action
  async releasePlayer(leagueId, golfer) {
    await mfgFetch(`/api/league/${leagueId}/roster/${golfer.key}`,
      {method: 'DELETE'});
  }

  @action
  async addPlayer(leagueId, golfer) {
    await mfgFetch(`/api/league/${leagueId}/roster`,
      {
        method: 'POST',
        body: JSON.stringify(golfer)
      });
  }

  @action
  async getAvailablePlayers(league, force = false) {

    if (isNil(league) && force === false) {
      return this.availablePlayers;
    }

    const id = isString(league) ? league : league._id;

    const response =
      //eslint-disable-next-line
      await mfgFetch(`/api/league/${id}/availablePlayers`,
        {method: 'GET'});

    this.availablePlayers = response.players;

    return this.availablePlayers;
  }

  @action
  async getDraft(league, force = false) {
    if (isNil(league)) {
      return this.draft;
    }

    if (!isNil(this.draft) && force !== true) {
      return this.draft;
    }

    const id = isString(league) ? league : league._id;

    const response =
      await mfgFetch(`/api/league/${id}/draft`,
        {method: 'GET'}
      );

    this.draft = response.draft;
    return this.draft;
  }

  @action
  async getMyDraftList(league, force = false) {
    if (isNil(league)) {
      return this.myDraftList;
    }

    if (!isNil(this.myDraftList) && force !== true) {
      return this.myDraftList;
    }

    const id = isString(league) ? league : league._id;

    const response =
      await mfgFetch(`/api/league/${id}/draftList`,
        { method: 'GET' });

    if (isNil(response)) {
      return;
    }

    this.myDraftList = response.players;
    return this.myDraftList;
  }

  @action
  async addPlayerToMyList(league, player, index = 0) {
    this.myDraftList.splice(index, 0, player);

    await mfgFetch(`/api/league/${league._id}/draftList`,
      {
        method: 'PUT',
        body: JSON.stringify({
          draftList: this.myDraftList
        })
      });

    this.getMyDraftList(league, true);
  }

  @action
  async removePlayerFromMyList(league, player) {
    const index = this.myDraftList.findIndex( (dPlayer) => {
      return player.key === dPlayer.key;
    });

    if (index === -1) {
      return;
    }

    this.myDraftList.splice(index, 1);

    await mfgFetch(`/api/league/${league._id}/draftList`,
      {
        method: 'PUT',
        body: JSON.stringify({
          draftList: this.myDraftList
        })
      });

    this.getMyDraftList(league, true);
  }

  @action
  async movePlayer(league, player, up = true) {
    const index = this.myDraftList.findIndex( (dPlayer) => {
      return player.key === dPlayer.key;
    });

    if (index + 1 === this.myDraftList.length && up === false) {
      return;
    }

    if (index === 0 && up === true) {
      return;
    }

    // remove the player
    this.myDraftList.splice(index, 1);

    if (up === true) {
      this.myDraftList.splice(index - 1, 0, player);
    }
    else {
      this.myDraftList.splice(index + 1, 0, player);
    }

    await mfgFetch(`/api/league/${league._id}/draftList`,
      {
        method: 'PUT',
        body: JSON.stringify({
          draftList: this.myDraftList
        })
      });

    this.getMyDraftList(league, true);
  }

  @action
  async startDraft(league, draftOptions) {

    const body = JSON.stringify({draftOptions});

    await mfgFetch(`/api/league/${league._id}/draft`,
      {
        method: 'POST',
        body: body
      });

    this.getDraftStatus(league);
  }

  @action
  async getDraftStatus(league) {
    const id = isString(league) ? league : league._id;

    const response = await mfgFetch(`/api/league/${id}/draft/status`,
      {
        method: 'GET'
      });

    this.draftStatus = response;
    this.draft = this.draftStatus.draft;

    return this.draftStatus;
  }

  async makePick(leagueId, round, pick, selection) {
    const body = JSON.stringify(selection);
    await mfgFetch(`/api/league/${leagueId}/draft/${round}/${pick}`,
      {
        method: 'PUT',
        body: body
      });

    await this.getDraftStatus(leagueId);
    await this.getAvailablePlayers(leagueId, true);
    await this.getMyDraftList(leagueId, true);
  }
}

export default RosterService;
