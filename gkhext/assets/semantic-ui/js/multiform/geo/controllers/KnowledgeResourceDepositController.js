
import _isNil from "lodash/isNil";
import _isEmpty from 'lodash/isEmpty';

import { BaseGeoDepositController } from "./BaseGeoDepositController";

import { geoGlobalStore } from '../../configStore';
import { ACTION_CREATE_SUCCEEDED, ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED } from '../state/types';


export class KnowledgeResourceDepositController extends BaseGeoDepositController {

  checkResourceDraftFiles(draft) {
    if (_isNil(draft.files))
      return { ...draft, files: { enabled: false } }
    return draft;
  }

  async prepareResourceDraft(draft, knowledgePackageDOI, { store }) {
    const recordSerializer = store.config.recordSerializer;
    let payload = recordSerializer.serialize(draft);

    // Adding related identifier to the draft
    payload.metadata.related_identifiers = [
      {
        "identifier": knowledgePackageDOI,
        "relation_type": {
          "id": "ispartof",
        },
        "resource_type": {
          "id": "knowledge",
        },
        "scheme": "doi"
      }
    ];

    // checking files
    payload = this.checkResourceDraftFiles(payload);

    // send to API (if necessary, draft is created)
    let response = null;

    if (!super.draftAlreadyCreated(payload))
      response = await this.apiClient.create(payload);
    else
      response = await this.apiClient.save(payload);

    // TODO: Deal with case when create fails using formik.setErrors(errors);
    store.dispatch({
      type: ACTION_CREATE_SUCCEEDED,
      payload: { data: recordSerializer.deserialize(response.data) },
    });

    return response;
  }

  /**
 * Publishes the current draft (backend).
 *
 * @param {object} draft - current draft
 * @param {object} formik - the Formik object
 * @param {object} store - redux store
 */
  async publishDraft(draft, { formik, store }) {
    // getting the global store (FixMe: This is no better way to do it. Find a better solution in the future)
    const knowledgePackage = geoGlobalStore.getState().knowledgePackage;

    // Knowledge Package PID (DOI)
    const knowledgePackageDOI = knowledgePackage.pids.doi.identifier;

    // creating the knowledge resource draft
    let response = await this.prepareResourceDraft(draft, knowledgePackageDOI, { store });

    // publishing
    const publishedDraft = await super.publishDraft(response.data, { formik, store });
    const publishedDraftData = publishedDraft.data;

    if (_isEmpty(publishedDraft.errors)) {
      // if success, then link the record to the knowledge package
      const knowledgePackageDraft = await this.createDraftFromAPI(knowledgePackage.id);

      let knowledgePackagePayload = knowledgePackageDraft.data;
      if (!knowledgePackagePayload.metadata.related_identifiers) {
        knowledgePackagePayload.metadata.related_identifiers = [];
      }

      // linking the knowledge package with the new resource
      knowledgePackagePayload.metadata.related_identifiers = [...knowledgePackagePayload.metadata.related_identifiers, {
        "identifier": publishedDraftData.pids.doi.identifier,
        "scheme": "doi",
        "relation_type": {
          "id": "haspart",
        },
        "resource_type": { "id": publishedDraftData.metadata.resource_type }
      }];

      // sending to the server
      await this.apiClient.save(knowledgePackagePayload);
      await this.apiClient.publish(knowledgePackagePayload);

      // creating a new draft to allow future modifications
      response = await this.createDraftFromAPI(knowledgePackage.id);

      if (_isEmpty(response.errors)) {
        geoGlobalStore.dispatch({
          type: ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED
        });
      };

    }
    return publishedDraft;
  }
}
