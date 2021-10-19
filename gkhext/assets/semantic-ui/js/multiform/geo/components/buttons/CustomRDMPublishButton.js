// This file is adapted from React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from 'lodash/get';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { ActionButton } from 'react-invenio-forms';
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Icon, Button, Modal, Message } from 'semantic-ui-react';

import { geoGlobalStore } from '../../../configStore';

import { FORM_PUBLISHING, FORM_ACTION_EVENT_EMITTED, ACTION_SAVE_KNOWLEDGE_ENABLE } from "../../state/types";


export class CustomRDMPublishButtonComponent extends Component {
    state = { confirmOpen: false };

    handleOpen = () => this.setState({ confirmOpen: true });

    handleClose = () => this.setState({ confirmOpen: false });

    render() {
        const { formState, publishClick, numberOfFiles, errors, ...uiProps } =
            this.props;

        const handlePublish = (event, formik) => {
            // temporary solution (dispatch action to communicate with modal)
            // FIXME: In the future, change this to a more general solution
            geoGlobalStore.dispatch({
                type: ACTION_SAVE_KNOWLEDGE_ENABLE
            });

            publishClick(event, formik);
            this.handleClose();
        };

        const action = i18next.t('publish');
        const capitalizedAction = action[0].toUpperCase() + action.slice(1);
        return (
            <>
                <ActionButton
                    name="publish"
                    onClick={this.handleOpen}
                    positive
                    icon
                    labelPosition="left"
                    {...uiProps}
                >
                    {(formik) => (
                        <>
                            {formik.isSubmitting && formState === FORM_PUBLISHING ? (
                                <Icon size="large" loading name="spinner" />
                            ) : (
                                <Icon name="upload" />
                            )}
                            {capitalizedAction}
                        </>
                    )}
                </ActionButton>

                {!_isEmpty(errors) && (
                    <Message
                        error
                        header='There was some errors with your submission'
                        list={[
                            'You must include both a upper and lower case letters in your password.',
                            'You need to select your home country.',
                        ]}
                    />
                )}

                {this.state.confirmOpen && (
                    <Modal
                        open={this.state.confirmOpen}
                        onClose={this.handleClose}
                        size="small"
                    >
                        <Modal.Content>
                            <h3>
                                {i18next.t(`Are you sure you want to {{action}} this record?`, {
                                    action: action,
                                })}
                            </h3>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.handleClose} floated="left">
                                Cancel
                            </Button>
                            <ActionButton
                                positive
                                name="publish"
                                onClick={handlePublish}
                                content={capitalizedAction}
                            />
                        </Modal.Actions>
                    </Modal>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    formState: state.deposit.formState,
    numberOfFiles: Object.values(state.files.entries).length,
    errors: state.deposit.errors,
});

const mapDispatchToProps = (dispatch) => ({
    publishClick: (event, formik) => {
        dispatch((dispatch, getState, config) => {
            dispatch({
                type: FORM_ACTION_EVENT_EMITTED,
                payload: FORM_PUBLISHING,
            });
            formik.handleSubmit(event);
        })
    }
});

export const CustomRDMPublishButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomRDMPublishButtonComponent);
