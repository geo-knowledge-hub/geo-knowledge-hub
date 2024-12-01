/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";

import _truncate from "lodash/truncate";

import { Image } from "react-invenio-forms";
import { Card, Grid, Message, Placeholder } from "semantic-ui-react";

const PlaceholderLoader = ({ size, isLoading, children, ...props }) => {
  const PlaceholderItem = () => (
    <Grid.Column width={3}>
      <Placeholder>
        <Placeholder.Image square />
      </Placeholder>
      <Placeholder>
        <Placeholder.Paragraph>
          <Placeholder.Line length="medium" />
          <Placeholder.Line length="short" />
        </Placeholder.Paragraph>
      </Placeholder>
    </Grid.Column>
  );
  let numberOfHeader = [];
  for (let i = 0; i < size; i++) {
    numberOfHeader.push(<PlaceholderItem key={i} />);
  }

  if (!isLoading) {
    return children;
  }
  return (
    <Grid columns="equal" stackable>
      {numberOfHeader}
    </Grid>
  );
};

PlaceholderLoader.propTypes = {
  size: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

PlaceholderLoader.defaultProps = {
  size: 5,
};

const EmptyMessage = ({ message }) => {
  return <Message icon="info" header={message} />;
};

EmptyMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

class CommunityCard extends Component {
  render() {
    const { community, defaultLogo } = this.props;
    return (
      <Card fluid href={`/communities/${community.slug}`}>
        <Image
          wrapped
          centered
          ui={false}
          src={community.links.logo}
          fallbackSrc={defaultLogo}
          loadFallbackFirst
        />
        <Card.Content>
          <Card.Header>
            {_truncate(community.metadata.title, { length: 30 })}
          </Card.Header>
          {community.metadata.description && (
            <Card.Description>
              <div className="truncate-lines-2">{community.metadata.description}</div>
            </Card.Description>
          )}
        </Card.Content>
      </Card>
    );
  }
}

CommunityCard.propTypes = {
  community: PropTypes.object.isRequired,
  defaultLogo: PropTypes.string.isRequired,
};

const CommunitiesCardGroupLocal = ({ communities, emptyMessage, defaultLogo }) => {

  console.log("CommuntiesCardGroupLocal");
  console.log(communities.hits.hits.length);

  return (
    <PlaceholderLoader isLoading={false}>
      {communities.hits.hits.length === 0 ? (
        <EmptyMessage message={emptyMessage} />
      ) : (
        <Card.Group
          doubling
          stackable
          itemsPerRow={5}
          className="community-frontpage-cards"
        >
          {communities.hits.hits.map((community) => {
            return (
              <CommunityCard
                key={community.id}
                community={community}
                defaultLogo={defaultLogo}
              />
            );
          })}
        </Card.Group>
      )}
    </PlaceholderLoader>
  );

}

CommunitiesCardGroupLocal.propTypes = {
  communities: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultLogo: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
};

const engagedCommunitiesContainer = document.getElementById("engaged-communities");

if (engagedCommunitiesContainer) {
  const communitiesData = JSON.parse(engagedCommunitiesContainer.dataset.communities);

  ReactDOM.render(
    <CommunitiesCardGroupLocal
      communities={communitiesData}
      emptyMessage="You are not a member of any community."
      defaultLogo="/static/images/square-placeholder.png"
    />,
    engagedCommunitiesContainer
  );
}
