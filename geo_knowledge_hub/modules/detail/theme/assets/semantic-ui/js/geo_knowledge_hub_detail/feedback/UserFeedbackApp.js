/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import { Container } from "semantic-ui-react";

import { FeedbackModal, RatingOverview } from "./components";

export class UserFeedbackApp extends Component {
  constructor(props) {
    super(props);

    this.state = { isFeedbackModalOpen: false, isNewFeedbackModalOpen: false };
  }

  modalFeedbackHandler = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isFeedbackModalOpen: !prevState.isFeedbackModalOpen,
      };
    });
  };

  modalNewReviewHandler = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isNewFeedbackModalOpen: !prevState.isNewFeedbackModalOpen,
      };
    });
  };

  render() {
    return (
      <Container>
        <RatingOverview
          listFeedbackHandler={this.modalFeedbackHandler}
          createFeedbackHandler={this.modalNewReviewHandler}
        />

        <FeedbackModal
          modalHandler={this.modalNewReviewHandler}
          isModalOpen={this.state.isNewFeedbackModalOpen}
        />
        {/* ToDo: This will be implemented in a near future */}
        {/* <ListRatingModal
          modalHandler={this.modalFeedbackHandler}
          isModalOpen={this.state.isFeedbackModalOpen}
        /> */}
      </Container>
    );
  }
}
