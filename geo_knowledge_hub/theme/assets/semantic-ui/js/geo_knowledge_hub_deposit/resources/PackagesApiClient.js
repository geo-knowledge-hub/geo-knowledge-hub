/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { http } from "./api";

/**
 * GEO Knowledge Hub Packages API Response.
 */
export class PackagesApiClientResponse {
  constructor(data, errors, code) {
    this.data = data;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * GEO Knowledge Hub Packages API Client.
 */
export class PackagesApiClient {
  constructor(httpClient = http) {
    this.httpClient = httpClient;
  }

  async createResponse(axios_call) {
    try {
      let response = await axios_call();
      return new PackagesApiClientResponse(
        response.data,
        response.data.errors,
        response.status
      );
    } catch (error) {
      return new PackagesApiClientResponse(
        error.response.data,
        error.response.data.errors,
        error.response.status
      );
    }
  }

  /**
   * Read package from server
   */
  async read(packageObj) {
    const operationUrl = packageObj.links.self;

    return this.createResponse(() =>
      this.httpClient.get(operationUrl, {
        params: {
          expand: 1,
        },
      })
    );
  }

  /**
   * Associate Drafts with a Package Context.
   */
  async contextAssociateDrafts(packageObj, drafts) {
    const operationUrl = packageObj.links.context_associate;

    const recordsToBeAssociated = drafts.map((draft) => ({
      id: draft.id,
    }));

    return this.createResponse(() =>
      this.httpClient.post(operationUrl, {
        records: recordsToBeAssociated,
      })
    );
  }

  /**
   * Dissociate Drafts from a Package Context.
   */
  async contextDissociateDrafts(packageObj, drafts) {
    const operationUrl = packageObj.links.context_dissociate;

    const recordsToBeDissociated = drafts.map((draft) => ({
      id: draft.id,
    }));

    return this.createResponse(() =>
      this.httpClient.post(operationUrl, {
        records: recordsToBeDissociated,
      })
    );
  }

  /**
   * Add resources to specific version of a package.
   */
  async packageAddResources(packageObj, resources) {
    const operationUrl = packageObj.links.resources;

    const resourcesToBeAdded = resources.map((resource) => ({
      id: resource.id,
    }));

    return this.createResponse(() =>
      this.httpClient.post(operationUrl, {
        resources: resourcesToBeAdded,
      })
    );
  }

  /**
   * Remove resources from specific version of a package.
   */
  async packageRemoveResources(packageObj, resources) {
    const operationUrl = packageObj.links.resources;

    const resourcesToBeAdded = resources.map((resource) => ({
      id: resource.id,
    }));

    return this.createResponse(() =>
      this.httpClient.delete(operationUrl, {
        data: {
          resources: resourcesToBeAdded,
        },
      })
    );
  }

  /**
   * Import resources from the previous version of a package.
   */
  async packageImportResources(packageObj) {
    const operationUrl = packageObj.links.resources_import;

    return this.createResponse(() => this.httpClient.post(operationUrl));
  }
}
