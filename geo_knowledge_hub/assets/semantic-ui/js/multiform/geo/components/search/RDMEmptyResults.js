import React from "react";
import {
  Icon,
  Button,
  Segment,
  Header,
  Divider,
} from "semantic-ui-react";

export const RDMEmptyResults = (props) => {
    const queryString = props.queryString;
    return queryString === "" ? (
        <Segment.Group>
            <Segment placeholder textAlign="center" padded="very">
                <Header as="h1" align="center">
                    <Header.Content>
                        Get started!
                        <Header.Subheader>Make your first upload!</Header.Subheader>
                    </Header.Content>
                </Header>
                <Divider hidden />
                <Button
                    color="green"
                    icon="upload"
                    floated="right"
                    href="/uploads/new"
                    content="New upload"
                />
            </Segment>
        </Segment.Group>
    ) : (
        <Segment placeholder textAlign="center">
            <Header icon>
                <Icon name="search" />
                No results found!
            </Header>
        </Segment>
    );
};
