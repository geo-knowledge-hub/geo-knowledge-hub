
import _set from 'lodash/set';
import _map from "lodash/map";
import _get from "lodash/get";
import _isNil from "lodash/isNil";
import _isEmpty from 'lodash/isEmpty';
import _difference from "lodash/difference";

import { BaseGeoDepositController } from './BaseGeoDepositController';
import _ from 'lodash';


export class UniqueKnowledgeResourceDepositController extends BaseGeoDepositController {
    /**
   * TODO
   *
   * @param {object} draft - current draft
   * @param {object} formik - the Formik object
   * @param {object} store - redux store
   */
    async createDraftFromDOIIdentifier(doiIdentifier) {
        return await this.createDraftFromAPI(doiIdentifier.split("/")[1]);
    }

    /**
   * Publishes the current draft (backend) and redirects to its view URL.
   *
   * @param {object} draft - current draft
   * @param {object} formik - the Formik object
   * @param {object} store - redux store
   */
    async publishDraft(draft, { formik, store }) {

        // getting latest record version
        let latestRecordVersion = null;
        if (!_isNil(draft.id)) {
            const response = await this.apiClient.getLatestRecordVersion(draft.id);

            if (200 <= response.code && response.code < 300 && _isEmpty(response.errors))
                latestRecordVersion = response.data;
        }

        const publishedDraft = await super.publishDraft(draft, { formik, store });
        const publishedDraftData = publishedDraft.data;

        if (_isEmpty(publishedDraft.errors)) {
            // checking for removed relationships with knowledge packages (only if latest version is available)
            if (!_isNil(latestRecordVersion)) {
                const newIdentifiers = _map(publishedDraftData.metadata.related_identifiers, "identifier");
                const oldIdentifiers = _map(latestRecordVersion.metadata.related_identifiers, "identifier");

                // update the removed knowledge packages
                const diffIdentifiers = _difference(oldIdentifiers, newIdentifiers);

                diffIdentifiers.map(async (identifier) => {
                    let knowledgePackageDraft = await this.createDraftFromDOIIdentifier(identifier);
                    knowledgePackageDraft = knowledgePackageDraft.data;

                    knowledgePackageDraft.metadata.related_identifiers = _get(knowledgePackageDraft.metadata, "related_identifiers", []).filter((x) => {
                        return x.identifier !== publishedDraftData.pids.doi.identifier;
                    });

                    // sending to the server
                    await this.apiClient.saveAndPublish(knowledgePackageDraft);
                });
            }

            await Promise.all(publishedDraft.data.metadata.related_identifiers.map(async (relatedResource) => {
                if (relatedResource.resource_type === "knowledge") {
                    let knowledgePackageDraft = await this.createDraftFromDOIIdentifier(relatedResource.identifier);                    
                    knowledgePackageDraft = knowledgePackageDraft.data;
                    
                    // linking the knowledge package with the new resource
                    knowledgePackageDraft.metadata.related_identifiers = [..._get(knowledgePackageDraft.metadata, "related_identifiers", []), {
                        "identifier": publishedDraftData.pids.doi.identifier,
                        "scheme": "doi",
                        "relation_type": {
                            "id": "haspart",
                        },
                        "resource_type": { "id": publishedDraftData.metadata.resource_type }
                    }];

                    // sending to the server
                    await this.apiClient.saveAndPublish(knowledgePackageDraft);
                }
            }));

            const recordURL = publishedDraftData.links.self_html;
            window.location.replace(recordURL);
        }
    }
}
