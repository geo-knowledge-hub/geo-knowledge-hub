import { Container, Step, Icon, Grid } from "semantic-ui-react";
import React from "react";

export const DepositStep = (props) => {
  const { stepHandler, isRecordPublished } = props;
  const currentStep = { [props.stepName]: true };

  return (
    <Container textAlign="center" style={{ marginTop: "2rem" }}>
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
                <Icon name="box" />
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
                <Icon name="file alternate outline" />
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
                <Icon name="database" />
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
                <Icon name="code" />
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
                <Icon name="ellipsis horizontal" />
                <Step.Content>
                  <Step.Title>Others</Step.Title>
                </Step.Content>
              </Step>
            </Step.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
