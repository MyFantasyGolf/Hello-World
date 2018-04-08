const mfgFetch = async (url, reqBody) => {
  return fetch(url, {
    ...reqBody,
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    credentials: 'same-origin'
  });
};

export default mfgFetch;
