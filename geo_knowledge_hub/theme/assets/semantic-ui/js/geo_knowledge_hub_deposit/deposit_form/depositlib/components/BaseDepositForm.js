/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { Component } from "react";

export class BaseDepositForm extends Component {
  constructor(props) {
    super(props);

    // defining configuration properties
    this.depositConfigHandler = props.depositConfigHandler || {};
    this.libraryVocabulariesHandler = props.libraryVocabulariesHandler || {};
  }
}
