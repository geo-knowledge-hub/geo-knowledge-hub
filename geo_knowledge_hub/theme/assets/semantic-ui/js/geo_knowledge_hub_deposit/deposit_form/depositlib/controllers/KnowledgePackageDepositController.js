/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import { BaseGeoDepositController } from "./BaseGeoDepositController";

export class KnowledgePackageDepositController extends BaseGeoDepositController {
  createUrlFromResponseObject(responseObject, baseUrl) {
    const recordBaseUrl = new URL(responseObject.data.links.self_html);
    return new URL(
      `${baseUrl}/${responseObject.data.id}`,
      recordBaseUrl.origin
    );
  }

  /**
   * Publishes the current draft (backend).
   *
   * @param {object} draft - current draft
   * @param {object} formik - the Formik object
   * @param {object} store - redux store
   */
  async publishDraft(draft, { formik, store }) {
    const publishedDraft = await super.publishDraft(draft, { formik, store });

    // defining a new draft to allow editing
    const newDraft = await this.createDraftFromAPI(publishedDraft.data.id);

    // preparing the deposit url
    const recordDepositUrl = this.createUrlFromResponseObject(
      newDraft,
      "/uploads"
    );

    window.location.replace(recordDepositUrl);
    return publishedDraft;
  }

  async createDraft(draft, { store }) {
    const response = await super.createDraft(draft, { store });

    const draftURL = response.data.links.self_html;
    window.history.replaceState(undefined, "", draftURL);
    return response;
  }
}
