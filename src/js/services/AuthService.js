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
        }),
        credentials: 'same-origin'
      });

      if (response.ok !== true) {
        return { error: `${response.status} - ${response.message}` };
      }

      const user = await response.json();
      this.me = user;
      return { user };
    }
    catch( err ) {
      return { error: err };
    }
  }

  @action
  async registerUser(creds) {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(creds),
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        credentials: 'same-origin'
      });

      if (response.ok !== true) {
        const text = await response.text();
        return { error: `${response.status} - ${text}` };
      }

      const user = await response.json();
      this.me = user;
      return { user };
    }
    catch( err ) {
      return { error: err };
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
        }),
        credentials: 'same-origin'
      });

      if (response.ok !== true) {
        const text = await response.text();
        return { error: `${response.status} - ${text}` };
      }

      const user = await response.json();
      this.me = user;
      return { user };
    }
    catch( err ) {
      return { error: err };
    }
  }

  @action
  async logout() {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'same-origin'
    });

    this.me = null;
  }
}


export default AuthService;
