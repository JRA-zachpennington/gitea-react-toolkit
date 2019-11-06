import Path from 'path';

import {
  apiPath, get, post, put, del,
} from '../';

// POST /api/v1/repos/{owner}/{repo}/contents/{filepath}
export const createContent = async ({
  owner, repo, filepath, payload, config,
}): Promise<any> => {
  const url = Path.join(apiPath, 'repos', owner, repo, 'contents', filepath);
  const response = await post({
    url, payload, config,
  });
  return response;
};

// GET /api/v1/repos/{owner}/{repo}/contents/{filepath}?ref={branch}
export const readContent = async ({
  owner, repo, filepath, config,
}): Promise<object> => {
  const url = Path.join(apiPath, 'repos', owner, repo, 'contents', filepath);
  let response;

  try {
    response = await get({
      url, config, noCache: true,
    });
  } catch (error) {
    response = null;
  }
  return response;
};

// PUT /api/v1/repos/{owner}/{repo}/contents/{filepath}
export const updateContent = async ({
  owner, repo, filepath, payload, config,
}): Promise<object> => {
  const url = Path.join(apiPath, 'repos', owner, repo, 'contents', filepath);
  let response;

  try {
    response = await put({
      url, payload, config,
    });
  } catch (error) {
    response = null;
  }
  return response;
};

// DELETE /api/v1/repos/{owner}/{repo}/contents/{filepath}?ref={branch}
export const removeFile = async ({
  owner, repo, filepath, payload, config,
}): Promise<object> => {
  const url = Path.join(apiPath, 'repos', owner, repo, 'contents', filepath);
  let response;

  try {
    response = await del({
      url, payload, config,
    });
  } catch (error) {
    response = null;
  }
  return response;
};

export const ensureFile = async ({
  owner, repo, filepath, payload, config,
}): Promise<object> => {
  let file = await readContent({
    owner, repo, filepath, config,
  });

  if (!file) {
    const { content } = await createContent({
      owner, repo, filepath, payload, config,
    });
    file = content;
  }
  return file;
};
