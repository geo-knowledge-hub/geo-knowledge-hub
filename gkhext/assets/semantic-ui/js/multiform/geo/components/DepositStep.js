import { Container, Step, Icon, Grid } from "semantic-ui-react";
import React, { Component } from "react";

export class DepositStep extends Component {

  constructor(props) {
    super(props);
  };

  render() {
    const currentStep = { [this.props.stepName]: true }

    return (
      <Container textAlign='center' style={{ marginTop: "2rem", }}>
        <Grid>
          <Grid.Row centered>
            <Grid.Column width={15}>
              <Step.Group fluid size={'mini'}>
                <Step active={currentStep.general}>
                  <Icon name="box" />
                  <Step.Content>
                    <Step.Title>Knowledge Package</Step.Title>
                  </Step.Content>
                </Step>
                <Step active={currentStep.publications}>
                  <Icon name="file alternate outline" />
                  <Step.Content>
                    <Step.Title>Publications</Step.Title>
                  </Step.Content>
                </Step>
                <Step active={currentStep.data}>
                  <Icon name="database" />
                  <Step.Content>
                    <Step.Title>Data</Step.Title>
                  </Step.Content>
                </Step>
                <Step active={currentStep.software}>
                  <Icon name="code" />
                  <Step.Content>
                    <Step.Title>Software</Step.Title>
                  </Step.Content>
                </Step>
                <Step active={currentStep.others}>
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
    )
  }
};
