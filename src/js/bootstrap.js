import ServiceRegistry from './services/ServiceRegistry';

import AuthService from './services/AuthService';
import LeagueService from './services/LeagueService';
import RosterService from './services/RosterService';

ServiceRegistry.register(AuthService, LeagueService, RosterService);
