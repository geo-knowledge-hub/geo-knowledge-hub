/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";

import {Container, Step, Icon, Grid} from "semantic-ui-react";

import {SemanticToastContainer} from "react-semantic-toasts";

export const DepositStep = (props) => {
  const {stepHandler, isRecordPublished} = props;
  const currentStep = {[props.stepName]: true};

  return (
    <Container textAlign="center" style={{marginTop: "2rem"}}>
      <Grid>
        <Grid.Row centered>
          <Grid.Column width={15}>
            <Step.Group fluid size={"mini"}>
              <Step
                active={currentStep.general}
                onClick={() => {
                  stepHandler(1);
                }}
              >
                <Icon name="box"/>
                <Step.Content>
                  <Step.Title>Knowledge Package</Step.Title>
                </Step.Content>
              </Step>
              <Step
                active={currentStep.publications}
                disabled={!isRecordPublished}
                onClick={() => {
                  stepHandler(2);
                }}
              >
                <Icon name="file alternate outline"/>
                <Step.Content>
                  <Step.Title>Publications</Step.Title>
                </Step.Content>
              </Step>
              <Step
                active={currentStep.data}
                disabled={!isRecordPublished}
                onClick={() => {
                  stepHandler(3);
                }}
              >
                <Icon name="database"/>
                <Step.Content>
                  <Step.Title>Data</Step.Title>
                </Step.Content>
              </Step>
              <Step
                active={currentStep.software}
                disabled={!isRecordPublished}
                onClick={() => {
                  stepHandler(4);
                }}
              >
                <Icon name="code"/>
                <Step.Content>
                  <Step.Title>Software</Step.Title>
                </Step.Content>
              </Step>
              <Step
                active={currentStep.others}
                disabled={!isRecordPublished}
                onClick={() => {
                  stepHandler(5);
                }}
              >
                <Icon name="ellipsis horizontal"/>
                <Step.Content>
                  <Step.Title>Others</Step.Title>
                </Step.Content>
              </Step>
            </Step.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column width={12}>
            <div
              style={{
                width: "100%",
                height: "100%",
                zIndex: "9",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <SemanticToastContainer
                position={"top-center"}
                animation={"fade down"}
                maxToasts={3}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
