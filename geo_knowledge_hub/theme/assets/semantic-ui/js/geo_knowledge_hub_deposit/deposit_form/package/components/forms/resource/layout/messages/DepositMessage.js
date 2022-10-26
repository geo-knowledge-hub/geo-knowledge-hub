/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { Message } from "semantic-ui-react";

import { depositCleanMessages } from "../../../../../state/operations/deposit";

const DepositMessageComponent = ({
  componentId,
  depositOperationMessage,
  dispatchDepositCleanMessages,
}) => {
  // Processing received message
  const hasMessageContent = depositOperationMessage?.title !== undefined;
  const isNegativeMessage = depositOperationMessage?.errors?.length > 0;
  const isValidForThisComponent =
    componentId === depositOperationMessage?.componentId;

  return (
    <>
      {hasMessageContent && isValidForThisComponent && (
        <Message
          onDismiss={() => {
            dispatchDepositCleanMessages();
          }}
          error={isNegativeMessage}
          positive={!isNegativeMessage}
          header={depositOperationMessage.title}
          list={
            depositOperationMessage?.errors
              ? depositOperationMessage?.errors.map((error) => error.message)
              : []
          }
        />
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchDepositCleanMessages: () => dispatch(depositCleanMessages()),
});

const mapStateToProps = (state) => ({
  // Deposit
  depositOperationMessage: state.deposit.depositOperationMessage,
});

export const DepositMessage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositMessageComponent);

DepositMessage.propTypes = {
  componentId: PropTypes.str,
  depositOperationMessage: PropTypes.object,
  dispatchDepositCleanMessages: PropTypes.func,
};

DepositMessage.defaultProps = {
  componentId: undefined,
  depositOperationMessage: {},
  dispatchDepositCleanMessages: null,
};
