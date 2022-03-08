/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";

import { Formik } from "formik";
import { Button, Modal, Grid, Container, Label } from "semantic-ui-react";

import { StarsFeedback, TextFeedback } from "geo-feedback-react";

export class FeedbackModal extends Component {
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
        <Modal
          closeIcon
          size={"large"}
          centered={false}
          dimmer={"blurring"}
          open={this.props.isModalOpen}
          onClose={this.props.modalHandler}
        >
          <Modal.Header>Add your feedback</Modal.Header>
          <Modal.Content>
            <Grid columns={2} divided padded>
              <Grid.Column width={5}>
                <Container style={{ marginBottom: "2rem" }}>
                  <Label circular color={"blue"} key={"blue"}>
                    1
                  </Label>{" "}
                  Share your experience with this resource.
                </Container>

                {/* Defining the stars feedback component */}
                <StarsFeedback />
              </Grid.Column>

              <Grid.Column centered width={11}>
                <Container style={{ marginBottom: "2rem" }}>
                  <Label circular color={"blue"} key={"blue"}>
                    2
                  </Label>{" "}
                  Tell the community a bit about your experiences with this
                  resource.
                </Container>

                <TextFeedback />
              </Grid.Column>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {/* ToDo: Add handle state methods */}
            <Button onClick={() => false} primary>
              Save your feedback
            </Button>
          </Modal.Actions>
        </Modal>
      </Formik>
    );
  }
}
