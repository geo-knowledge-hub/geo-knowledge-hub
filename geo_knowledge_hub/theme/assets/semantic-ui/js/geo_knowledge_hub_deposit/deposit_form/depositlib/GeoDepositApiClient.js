/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import axios from 'axios';
import {DepositApiClient} from "@geo-knowledge-hub/react-invenio-deposit";

const apiConfig = {
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
  };
const axiosWithconfig = axios.create(apiConfig);

export class GeoDepositApiClient extends DepositApiClient {
  constructor(createUrl) {
    super(createUrl);
  }

  async createDraftFromApi(recordId) {
    const recordIdUrl = `/api/records/${recordId}/draft`;
    return this.createResponse(() => axiosWithconfig.post(recordIdUrl));
  }

  async getLatestRecordVersion(recordId) {
    const recordIdUrl = `/api/records/${recordId}/versions/latest`;
    return this.createResponse(() => axiosWithconfig.get(recordIdUrl));
  }

  async saveAndPublish(draft) {
    await this.save(draft);
    await this.publish(draft);
  }

}
