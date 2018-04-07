const mfgFetch = async (url, reqBody) => {
  return fetch(url, {
    ...reqBody,
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
};

export default mfgFetch;
