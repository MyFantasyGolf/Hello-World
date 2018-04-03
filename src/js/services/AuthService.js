import { observable, action } from 'mobx';
import isNil from 'lodash/isNil';

let instance;

class AuthService {

  @observable me = undefined;

  constructor() {
    if (isNil(instance)) {
      instance = this;
    }

    return instance;
  }

  @action
  async getCurrentUser() {
    if (!isNil(this.me)) {
      return this.me;
    }

    try {
      const response = await fetch('/api/currentUser', {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });

      const user = await response.json();
      this.me = user;
      return user;
    }
    catch( err ) {
      return;
    }
  }

  @action
  async login(creds) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(creds),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      });

      const user = await response.json();
      this.me = user;
      return user;
    }
    catch( err ) {
      return;
    }
  }
}

export default AuthService;
