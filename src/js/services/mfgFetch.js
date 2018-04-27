import ServiceRegistry from './ServiceRegistry';

const handleError = (badResponse) => {
  if (badResponse === 401) {
    const authService = ServiceRegistry.getService('authService');
    authService.destroySession();
  }
};

const mfgFetch = async (url, reqBody) => {
  
  try {
    const response = await fetch(url, {
      ...reqBody,
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      credentials: 'same-origin'
    });

    if (response.ok !== true) {
      handleError(response);
      return;
    }

    const body = await response.json();

    return body;
  }
  catch(err) {
    throw err;
  }
};

export default mfgFetch;
