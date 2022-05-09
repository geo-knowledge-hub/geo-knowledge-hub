import React from "react";

import _isEmpty from "lodash/isEmpty";

import { DepositController } from "@geo-knowledge-hub/react-invenio-deposit";

import axios from "axios";

import {
  ACTION_CREATE_SUCCEEDED,
  ACTION_DELETE_FAILED,
  ACTION_PUBLISH_FAILED,
  ACTION_PUBLISH_SUCCEEDED,
} from "../state/types";

const CancelToken = axios.CancelToken;
const apiConfig = {
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
};
const axiosWithconfig = axios.create(apiConfig);

export class BaseGeoDepositController extends DepositController {
  constructor(apiClient, fileUploader) {
    super(apiClient, fileUploader);
  }

  async createDraftFromAPI(recordId) {
    const response = await this.apiClient.createDraftFromApi(recordId);
    return response;
  }

  async createDraft(draft, { store }) {
    draft.pids = {};
    const recordSerializer = store.config.recordSerializer;
    const payload = recordSerializer.serialize(draft);

    const response = await this.apiClient.create(payload);

    // TODO: Deal with case when create fails using formik.setErrors(errors);
    store.dispatch({
      type: ACTION_CREATE_SUCCEEDED,
      payload: { data: recordSerializer.deserialize(response.data) },
    });

    return response;
  }

  /**
   * Deletes the current draft and redirects to uploads page.
   *
   * The current draft may not have been saved yet. We only delete the draft
   * if it has been saved.
   *
   * @param {object} draft - current draft
   */
  async deleteDraft(draft, { formik, store }) {
    if (draft.id) {
      const response = await this.apiClient.delete(draft);
      if (!(200 <= response.code && response.code < 300)) {
        store.dispatch({
          type: ACTION_DELETE_FAILED,
          payload: {},
        });
        return;
      }
    }
  }

  /**
   * Publishes the current draft (backend).
   *
   * @param {object} draft - current draft
   * @param {object} formik - the Formik object
   * @param {object} store - redux store
   */
  async publishDraft(draft, { formik, store }) {
    const recordSerializer = store.config.recordSerializer;
    let response = {};

    if (!this.draftAlreadyCreated(draft)) {
      response = await this.createDraft(draft, { store });
    }

    let payload = recordSerializer.serialize(draft);

    response = await this.apiClient.publish(payload);
    let data = recordSerializer.deserialize(response.data || {});
    let errors = recordSerializer.deserializeErrors(response.errors || []);

    // response 100% successful
    if (200 <= response.code && response.code < 300 && _isEmpty(errors)) {
      store.dispatch({
        type: ACTION_PUBLISH_SUCCEEDED,
        payload: { data },
      });
    }
    // "succeed or not, there is no partial"
    else {
      store.dispatch({
        type: ACTION_PUBLISH_FAILED,
        payload: { data, errors },
      });
      formik.setErrors(errors);
    }

    formik.setSubmitting(false);
    return { errors: errors, data: data };
  }
}
