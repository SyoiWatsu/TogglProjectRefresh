let _apiToken = '';

const ApiToken = {
  get: () => _apiToken,
  set: (value: string) => {
    _apiToken = value;
    return _apiToken;
  },
};

Object.freeze(ApiToken);
export { ApiToken };