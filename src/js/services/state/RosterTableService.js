import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';
import ServiceRegistry from '../ServiceRegistry';

class RosterTableService {

  @observable playerList = [];
  @observable loading = true;

  @action
  async loadPlayerList(currentRoster, activeRosterMap) {

    this.loading = true;
    const RosterService = ServiceRegistry.getService('RosterService');

    const extendActive = currentRoster.map( (golfer) => {
      const {key, firstName, lastName} = golfer;
      return {
        active: false,
        current: true,
        key,
        name: `${firstName} ${lastName}`,
        score: null,
        totalScore: 0
      };
    });

    if (isNil(activeRosterMap)) {
      this.playerList = extendActive;
      this.loading = false;
      return extendActive;
    }

    for (let i = 0; i < activeRosterMap.length; i++ ) {
      const activeGolfer = activeRosterMap[i];

      const golfer = extendActive.find( (aGolfer) => {
        return aGolfer.key === activeGolfer.key;
      });

      if (!isNil(golfer)) {
        golfer.active = true;
        golfer.score = activeGolfer.score;
      }
      else {
        const fullPlayer =
          await RosterService.getGolfer(activeGolfer.key);

        extendActive.push({
          active: false,
          current: false,
          key: activeGolfer.key,
          name: `${fullPlayer.firstName} ${fullPlayer.lastName}`,
          score: activeGolfer.score,
          totalScore: 0
        });

      }
    }

    this.playerList = extendActive;
    this.loading = false;
  }
}

export default RosterTableService;
