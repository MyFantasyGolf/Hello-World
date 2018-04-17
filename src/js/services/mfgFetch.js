const mfgFetch = async (url, reqBody) => {
  const response = await fetch(url, {
    ...reqBody,
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    credentials: 'same-origin'
  });

  if (response.ok !== 200) {
    throw response.status;
  }

  const body = await response.json();

  return body;
};

export default mfgFetch;
