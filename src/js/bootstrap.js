import ServiceRegistry from './services/ServiceRegistry';

import AuthService from './services/AuthService';
import LeagueService from './services/LeagueService';

ServiceRegistry.register(AuthService, LeagueService);
