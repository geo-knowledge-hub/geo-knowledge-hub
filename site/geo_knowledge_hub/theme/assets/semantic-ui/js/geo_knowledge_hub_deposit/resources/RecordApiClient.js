/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { http } from "./api";

/**
 * GEO Knowledge Hub Records API Response.
 */
export class RecordApiClientResponse {
  constructor(data, errors, code) {
    this.data = data;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * GEO Knowledge Hub Records API Client.
 */
export class RecordApiClient {
  constructor(httpClient = http) {
    this.httpClient = httpClient;
  }

  async createResponse(axios_call) {
    try {
      let response = await axios_call();
      return new RecordApiClientResponse(
        response.data,
        response.data.errors,
        response.status,
      );
    } catch (error) {
      return new RecordApiClientResponse(
        error.response.data,
        error.response.data.errors,
        error.response.status,
      );
    }
  }

  /**
   * Edit draft from server
   */
  async edit(recordObj) {
    const operationUrl = recordObj.links.draft;

    return this.createResponse(() => this.httpClient.post(operationUrl));
  }

  /**
   * Save draft.
   */
  async saveDraft(recordObj) {
    const operationUrl = recordObj.links.self;

    return this.createResponse(() =>
      this.httpClient.put(operationUrl, recordObj),
    );
  }

  /**
   * Delete draft.
   */
  async deleteDraft(recordObj) {
    const operationUrl = recordObj.links.self;

    return this.createResponse(() => this.httpClient.delete(operationUrl));
  }

  /**
   * New record version.
   */
  async newVersion(recordObj) {
    const operationUrl = recordObj.links.versions;

    return this.createResponse(() => this.httpClient.post(operationUrl));
  }

  /**
   * Publish a draft
   */
  async publishDraft(recordObj) {
    const operationUrl = recordObj.links.publish;

    return this.createResponse(() => this.httpClient.post(operationUrl));
  }

  /**
   * Get files
   */
  async listFiles(recordObj) {
    const operationUrl = recordObj.links.files;

    return this.createResponse(() =>
      this.httpClient.get(operationUrl, {
        headers: {
          Accept: "application/json",
        },
      }),
    );
  }
}
