import ServiceRegistry from './services/ServiceRegistry';

import AuthService from './services/AuthService';
import LeagueService from './services/LeagueService';
import RosterService from './services/RosterService';
import StatService from './services/StatService';
import LoadingService from './services/LoadingService';

import RosterTableService from './services/state/RosterTableService';

ServiceRegistry.register(
  AuthService,
  LeagueService,
  RosterService,
  StatService,
  RosterTableService,
  LoadingService
);
