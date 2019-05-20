import React, { useState } from "react";
import PropTypes from 'prop-types';

import { Search } from './Search';
import { Repositories } from './Repositories';

function withRepositoryComponent(Component) {
  return function RepositoryComponent ({
    repository,
    onRepository,
    ...props
  }) {
    const [repo, setRepo] = useState(repository);

    let repositoryConfig = {};
    if (props.repositoryConfig) {
      const {repositories, urls, defaultOwner, defaultQuery, ...config} = props.repositoryConfig;
      repositoryConfig = {repositories, urls, defaultOwner, defaultQuery, config};
    } else if (props.authentication && props.authentication.config) {
      repositoryConfig = {config: props.authentication.config};
    }
    const {
      repositories,
      urls,
      defaultOwner,
      defaultQuery,
      config
    } = repositoryConfig;

    const hasRepository = () => (repo && repo.name && repo.owner && repo.permissions );

    const updateRepository  = (_repo) => {
      if (_repo) _repo.close = () => {updateRepository()};
      if (onRepository) onRepository(_repo);
      else setRepo(_repo);
    }

    let component = <div />;
    if (!hasRepository() && (urls || repositories)) {
      component = (
        <Repositories
          urls={urls}
          repositories={repositories}
          onRepository={updateRepository}
          config={config}
        />
      );
    } else if (!hasRepository() && config) {
      let username;
      if (props.authentication) username = props.authentication.user.username;
      component = (
        <Search
          defaultOwner={defaultOwner || username}
          defaultQuery={defaultQuery}
          onRepository={updateRepository}
          config={config}
        />
      );
    }

    if (hasRepository()) {
      component = <Component {...props} repository={repo} blobConfig={config} />;
    }

    return component;
  }
}

withRepositoryComponent.propTypes = {
  /** Pass a previously returned repository object to bypass the selection. */
  repository: PropTypes.shape({
    id: PropTypes.number,
    owner: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    html_url: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired,
  }),
  /** Function to call when repository is selected, either server, urls, or repositories required. */
  onRepository: PropTypes.func.isRequired,
  /** Configuration to pass through to the Search/Repositories component. */
  repositoryConfig: PropTypes.shape({
    /** Urls array to get repository data, if repository data is not provided. */
    urls: PropTypes.array,
    /** Repositories data array to render, if urls not provided. */
    repositories: PropTypes.array,
    /** Prefill the owner search field. */
    defaultOwner: PropTypes.string,
    /** Prefill the query search field. */
    defaultQuery: PropTypes.string,
    /** Configuration required for Search or Repositories if paths are provided as URL. */
    server: PropTypes.string,
  }).isRequired,
};

export const withRepository = withRepositoryComponent;
