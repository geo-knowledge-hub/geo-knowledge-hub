/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import PropTypes from "prop-types";

import { Formik } from "formik";

import {
  Popup,
  Grid,
  Icon,
  Button,
  Header,
  Rating,
  Progress,
  Divider,
  Segment,
  List,
} from "semantic-ui-react";

export class RatingOverview extends Component {
  render() {
    return (
      <Formik
        initialValues={{
          name: "",
          comment: "",
          feedback: -1,
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Popup
          trigger={<Rating maxRating={5} defaultRating={3}></Rating>}
          flowing
          hoverable
        >
          <Segment>
            <Grid centered divided>
              <Divider horizontal>
                <Header as="h4">
                  <Icon name="chart bar outline" />
                  Feedback overview
                </Header>
              </Divider>

              <Grid.Row>
                <Grid.Column width={9}>
                  <List verticalAlign="middle" size={"medium"}>
                    <List.Item>
                      <List.Content>
                        <List.Header>Clarity</List.Header>
                        <Progress percent={67} progress />
                      </List.Content>
                    </List.Item>

                    <List.Item>
                      <List.Content>
                        <List.Header>Usefulness</List.Header>
                        <Progress percent={30} progress />
                      </List.Content>
                    </List.Item>

                    <List.Item>
                      <List.Content>
                        <List.Header>Reusability</List.Header>
                        <Progress percent={87} progress />
                      </List.Content>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={9}>
                  <Button.Group>
                    <Button
                      compact
                      size="small"
                      color="gray"
                      onClick={this.props.listFeedbackHandler}
                    >
                      <Icon name="conversation" /> See feedbacks
                    </Button>
                    <Button
                      compact
                      size="small"
                      color="gray"
                      onClick={this.props.createFeedbackHandler}
                    >
                      <Icon name="conversation" /> Add your review
                    </Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Popup>
      </Formik>
    );
  }
}

RatingOverview.propTypes = {
  listFeedbackHandler: PropTypes.func.isRequired,
  createFeedbackHandler: PropTypes.func.isRequired,
};

RatingOverview.propTypes = {
  listFeedbackHandler: (e) => {},
  createFeedbackHandler: (e) => {},
};
