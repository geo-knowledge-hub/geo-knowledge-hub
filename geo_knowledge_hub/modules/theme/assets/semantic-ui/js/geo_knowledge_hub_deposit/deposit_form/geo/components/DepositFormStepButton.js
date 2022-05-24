import { Button, Grid } from "semantic-ui-react";
import React, { Component } from "react";
import { geoGlobalContext } from "../../configStore";

import { connect } from "react-redux";

export class DepositFormStepButtonComponent extends Component {
  constructor(props) {
    super(props);

    this.includeFinish = props.includeFinish || false;
  }

  render() {
    if (this.includeFinish) {
      const { knowledgePackage } = this.props;
      const knowledgePackageLandingPage = knowledgePackage.links.latest_html;

      return (
        <Grid textAlign="center">
          <Grid.Row>
            <Grid.Column centered>
              <Button.Group>
                <Button
                  labelPosition="left"
                  icon="left chevron"
                  content="Previous"
                  onClick={this.props.previous}
                  disabled={!this.props.isPreviousActivated}
                />
                <Button.Or />
                <Button
                  positive
                  labelPosition="right"
                  icon="right arrow"
                  content="Go to Knowledge Package!"
                  href={knowledgePackageLandingPage}
                  disabled={!this.props.isPreviousActivated}
                />
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <Button.Group>
        <Button
          labelPosition="left"
          icon="left chevron"
          content="Previous"
          onClick={this.props.previous}
          disabled={!this.props.isPreviousActivated}
        />
        <Button.Or />
        <Button
          labelPosition="right"
          icon="right chevron"
          content="Next"
          onClick={this.props.next}
          disabled={!this.props.isNextActivated}
        />
      </Button.Group>
    );
  }
}

// redux store config
const mapStateToProps = (state) => ({
  knowledgePackage: state.knowledgePackage,
});

export const DepositFormStepButton = connect(mapStateToProps, null, null, {
  context: geoGlobalContext,
})(DepositFormStepButtonComponent);
