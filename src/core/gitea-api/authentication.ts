import base64 from 'base-64';
import utf8 from 'utf8';
import { AuthObject, AuthToken, AuthConfigObject } from './index.d';
import { getUser, ensureToken } from './users';
import { APIConfig } from './core';

interface authenticate {
  (args: { username: string; password: string; config: APIConfig }): Promise<AuthObject>;
}

export const authenticate: authenticate = async ({ username, password, config }) => {
  let token, user;
  let _config = { ...config };
  if (username && password) {
    let authHeaders = authorizationHeaders({ username, password });
    _config = { ...config, headers: { ...config.headers, ...authHeaders } };
    user = await getUser({ username, config: _config });
    token = await ensureToken({ username, config: _config });
    authHeaders = authorizationHeaders({ token });
    _config = { ...config, headers: { ...config.headers, ...authHeaders } };
  }
  const authentication = { user, token, config: _config };
  return authentication;
};

interface authorizationHeaders {
  (args: { username: string; password: string; token?: string | AuthToken }): object;
  (args: { username?: string; password?: string; token: string | AuthToken }): object;
}

export const authorizationHeaders: authorizationHeaders = ({ username, password, token }) => {
  let headers = {};
  const authorization = encodeAuthentication({ username, password, token });
  if (authorization) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': authorization,
    };
  }
  return headers;
};

interface encodeAuthentication {
  (args: { username: string; password: string; token?: AuthToken | string }): string;
  (args: { username?: string; password?: string; token: AuthToken | string }): string;
}

export const encodeAuthentication: encodeAuthentication = ({ username, password, token }) => {
  let authentication = '';
  if (token) {
    let sha1 = typeof token === 'object' ? token.sha1 : token;
    authentication = `token ${sha1}`;
  } else if (username && password) {
    const encoded = base64.encode(utf8.encode(`${username}:${password}`));
    authentication = 'Basic ' + encoded;
  }
  return authentication;
};
