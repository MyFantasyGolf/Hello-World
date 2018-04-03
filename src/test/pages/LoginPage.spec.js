import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import extractBaseElement from '../extractBaseElement';

import LoginPage from '../../src/js/pages/LoginPage';

describe( 'Test the login page components', () => {

  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  it( 'should show error text on a failed login', async () => {

    const loginElem = new (extractBaseElement(LoginPage))({
      AuthService: { me: 'me' }
    });

    const errorMsg = 'I have an error';
    loginElem.state = { error: errorMsg };

    const errorMessage = loginElem.getErrorMessage();
    expect(errorMessage).to.equal(errorMsg);
  });

  // eslint-disable-next-line
  it( 'should set the login state appropriately when call returns', async () => {
    const authService = {
      login: async () => {
        return { user: { username: 'me' }};
      }
    };

    const loginPage = new (extractBaseElement(LoginPage))({
      AuthService: authService
    });

    const stateSpy = sandbox.stub(loginPage, 'setState');
    await loginPage.login();

    expect(stateSpy.callCount).to.equal(1);

    const errorMsg = 'It blew up';

    authService.login = async () => {
      return { error: errorMsg };
    };

    await loginPage.login();

    expect(stateSpy.callCount).to.equal(3);
  });

  it( 'should call login if the button is clicked', () => {

    const mockAuth = {
      login: async () => {
        return { error: undefined};
      }
    };

    const LoginType = extractBaseElement(LoginPage);
    const wrapper = shallow(<LoginType AuthService={ mockAuth }></LoginType> );

    const authStub = sandbox.stub(mockAuth, 'login');

    wrapper.find('JawsButton').simulate('click');

    // eslint-disable-next-line
    expect(authStub.calledOnce).to.be.true;
  });
});
