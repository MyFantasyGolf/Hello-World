import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import mfgFetch from './mfgFetch';

let instance;

class RosterService {

  @observable availablePlayers = undefined;
  @observable myDraftList = undefined;
  @observable draft = undefined;

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  @action
  async getAvailablePlayers(league) {

    if (isNil(league)) {
      return this.availablePlayers;
    }

    if (isNil(this.availablePlayers)) {
      const response =
        //eslint-disable-next-line
        await mfgFetch(`/api/league/${league._id}/availablePlayers`,
          {method: 'GET'});

      this.availablePlayers = response.players;
    }

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

    const response =
      await mfgFetch(`/api/league/${league._id}/draft`,
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

    const response =
      await mfgFetch(`/api/league/${league._id}/draftList`,
        { method: 'GET' });

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

    try {
      await mfgFetch(`/api/league/${league._id}/draft`,
        {
          method: 'POST',
          body: body
        });
    }
    catch(err) {
      console.log(err);
    }
  }
}

export default RosterService;
