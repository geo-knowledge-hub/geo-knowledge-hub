
import React from "react";

import {
    Container,
    Grid,
    Button,
    Dropdown
} from "semantic-ui-react";

import { SearchBar } from "react-searchkit";

import {
    SearchAppFacets,
    SearchAppResultsPane,
} from "@js/invenio_search_ui/components";

export const CustomRDMUserRecordsSearchLayout = (props) => (
    <Container>
        <Grid>
            <Grid.Row columns={3}>
                <Grid.Column width={4} />
                <Grid.Column width={8}>
                    <SearchBar placeholder={"Search uploads..."} />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Button.Group color="green" floated="right" size="medium">
                        <Dropdown text="New Upload" floating className="button icon" icon="upload">
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => { window.location.replace("uploads/new?type=knowledge") }}
                                >
                                    Knowledge Package
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => { window.location.replace("uploads/new?type=resource") }}
                                >
                                    Knowledge Resource
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={4}>
                    <SearchAppFacets aggs={props.config.aggs} />
                </Grid.Column>
                <Grid.Column width={12}>
                    <SearchAppResultsPane layoutOptions={props.config.layoutOptions} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
);