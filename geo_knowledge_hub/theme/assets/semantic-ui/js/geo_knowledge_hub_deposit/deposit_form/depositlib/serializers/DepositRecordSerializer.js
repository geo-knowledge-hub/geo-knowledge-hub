/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _cloneDeep from 'lodash/cloneDeep';
import _defaults from 'lodash/defaults';
import _isArray from 'lodash/isArray';
import _isBoolean from 'lodash/isBoolean';
import _isEmpty from 'lodash/isEmpty';
import _isNull from 'lodash/isNull';
import _isNumber from 'lodash/isNumber';
import _isObject from 'lodash/isObject';
import _mapValues from 'lodash/mapValues';
import _pick from 'lodash/pick';
import _pickBy from 'lodash/pickBy';
import _set from 'lodash/set';

import {
    Field,
    SchemaField,
    VocabularyField,
    RightsVocabularyField,
    AllowAdditionsVocabularyField
} from "./fields";

const emptyIdentifier = {
    scheme: '',
    identifier: '',
};

const emptyRelatedWork = {
    scheme: '',
    identifier: '',
    resource_type: '',
    relation_type: '',
};

const emptyDate = {
    date: '',
    description: '',
    type: '',
};

const emptyFunding = {
    funder: {
        name: '',
        identifier: '',
        scheme: '',
    },
    award: {
        title: '',
        number: '',
        identifier: '',
        scheme: '',
    },
};


/**
 * @name DepositRecordSerializer.
 * @summary Serialize and deserialize record object and its fields.
 *
 * @note This class is based on React-Invenio-Deposit. Here, we only add
 *       our custom fields.
 *       (https://github.com/inveniosoftware/react-invenio-deposit/blob/cafac00f9667d96134d8a1bf4c2abbc285513aed/src/lib/DepositRecordSerializer.js#L52)
 */
export class DepositRecordSerializer {

    constructor(defaultLocale) {
        this.defaultLocale = defaultLocale;
    }

    depositRecordSchema = {
        files: new Field({
            fieldpath: 'files',
        }),
        links: new Field({
            fieldpath: 'links',
        }),
        pids: new Field({
            fieldpath: 'pids',
            deserializedDefault: {},
            serializedDefault: {},
        }),
        title: new Field({
            fieldpath: 'metadata.title',
            deserializedDefault: '',
        }),
        additional_titles: new SchemaField({
            fieldpath: 'metadata.additional_titles',
            schema: {
                title: new Field({
                    fieldpath: 'title',
                }),
                type: new VocabularyField({
                    fieldpath: 'type',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
                lang: new VocabularyField({
                    fieldpath: 'lang',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
            },
        }),
        additional_descriptions: new SchemaField({
            fieldpath: 'metadata.additional_descriptions',
            schema: {
                description: new Field({
                    fieldpath: 'description',
                }),
                type: new VocabularyField({
                    fieldpath: 'type',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
                lang: new VocabularyField({
                    fieldpath: 'lang',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
            },
        }),
        creators: new SchemaField({
            fieldpath: 'metadata.creators',
            schema: {
                person_or_org: new Field({
                    fieldpath: 'person_or_org',
                }),
                role: new VocabularyField({
                    fieldpath: 'role',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
                affiliations: new AllowAdditionsVocabularyField({
                    fieldpath: 'affiliations',
                    deserializedDefault: [],
                    serializedDefault: [],
                    labelField: 'name',
                }),
            },
        }),
        contributors: new SchemaField({
            fieldpath: 'metadata.contributors',
            schema: {
                person_or_org: new Field({
                    fieldpath: 'person_or_org',
                }),
                role: new VocabularyField({
                    fieldpath: 'role',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
                affiliations: new AllowAdditionsVocabularyField({
                    fieldpath: 'affiliations',
                    deserializedDefault: [],
                    serializedDefault: [],
                    labelField: 'name',
                }),
            },
        }),
        resource_type: new VocabularyField({
            fieldpath: 'metadata.resource_type',
            deserializedDefault: '',
            serializedDefault: '',
        }),
        access: new Field({
            fieldpath: 'access',
            deserializedDefault: {
                record: 'public',
                files: 'public',
            },
        }),
        publication_date: new Field({
            fieldpath: 'metadata.publication_date',
            deserializedDefault: '',
        }),
        dates: new SchemaField({
            fieldpath: 'metadata.dates',
            schema: {
                date: new Field({
                    fieldpath: 'date',
                }),
                type: new VocabularyField({
                    fieldpath: 'type',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
                description: new Field({
                    fieldpath: 'description',
                }),
            },
            deserializedDefault: [emptyDate],
        }),
        languages: new VocabularyField({
            fieldpath: 'metadata.languages',
            deserializedDefault: [],
            serializedDefault: [],
        }),
        identifiers: new SchemaField({
            fieldpath: 'metadata.identifiers',
            schema: {
                scheme: new Field({
                    fieldpath: 'scheme',
                }),
                identifier: new Field({
                    fieldpath: 'identifier',
                }),
            },
            deserializedDefault: [emptyIdentifier],
        }),
        related_identifiers: new SchemaField({
            fieldpath: 'metadata.related_identifiers',
            schema: {
                scheme: new Field({
                    fieldpath: 'scheme',
                }),
                identifier: new Field({
                    fieldpath: 'identifier',
                }),
                relation_type: new VocabularyField({
                    fieldpath: 'relation_type',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
                resource_type: new VocabularyField({
                    fieldpath: 'resource_type',
                    deserializedDefault: '',
                    serializedDefault: '',
                }),
            },
            deserializedDefault: [emptyRelatedWork],
        }),
        subjects: new AllowAdditionsVocabularyField({
            fieldpath: 'metadata.subjects',
            deserializedDefault: [],
            serializedDefault: [],
            labelField: 'subject',
        }),
        funding: new Field({
            fieldpath: 'metadata.funding',
            deserializedDefault: [emptyFunding],
        }),
        version: new Field({
            fieldpath: 'metadata.version',
            deserializedDefault: '',
        }),
        rights: new RightsVocabularyField({
            fieldpath: 'metadata.rights',
            deserializedDefault: [],
            serializedDefault: [],
            localeFields: ['title', 'description'],
        }),

        // Custom fields
        geo_work_programme_activity: new VocabularyField({
            fieldpath: "metadata.geo_work_programme_activity",
            deserializedDefault: "",
            serializedDefault: ""
        }),
        target_audiences: new VocabularyField({
            fieldpath: "metadata.target_audiences",
            deserializedDefault: [],
            serializedDefault: []
        }),
        engagement_priorities: new VocabularyField({
            fieldpath: "metadata.engagement_priorities",
            deserializedDefault: [],
            serializedDefault: []
        }),
    };

    /**
     * Remove empty fields from record
     * @method
     * @param {object} obj - potentially empty object
     * @returns {object} record - without empty fields
     */
    removeEmptyValues(obj) {
        if (_isArray(obj)) {
            let mappedValues = obj.map((value) => this.removeEmptyValues(value));
            let filterValues = mappedValues.filter((value) => {
                if (_isBoolean(value) || _isNumber(value)) {
                    return value;
                }
                return !_isEmpty(value);
            });
            return filterValues;
        } else if (_isObject(obj)) {
            let mappedValues = _mapValues(obj, (value) =>
                this.removeEmptyValues(value)
            );
            let pickedValues = _pickBy(mappedValues, (value) => {
                if (_isArray(value) || _isObject(value)) {
                    return !_isEmpty(value);
                }
                return !_isNull(value);
            });
            return pickedValues;
        }
        return _isNumber(obj) || _isBoolean(obj) || obj ? obj : null;
    }

    /**
     * Deserialize backend record into format compatible with frontend.
     * @method
     * @param {object} record - potentially empty object
     * @returns {object} frontend compatible record object
     */
    deserialize(record) {
        // NOTE: cloning nows allows us to manipulate the copy with impunity
        //       without affecting the original
        const originalRecord = _pick(_cloneDeep(record), [
            'access',
            'metadata',
            'id',
            'links',
            'files',
            'is_published',
            'versions',
            'pids',
            'ui',
        ]);

        // FIXME: move logic in a more sophisticated PIDField that allows empty values
        // to be sent in the backend
        let savedPidsFieldValue = originalRecord.pids || {};

        // Remove empty null values from record. This happens when we create a new
        // draft and the backend produces an empty record filled in with null
        // values, array of null values etc.
        // TODO: Backend should not attempt to provide empty values. It should just
        //       return existing record in case of edit or {} in case of new.
        let deserializedRecord = this.removeEmptyValues(originalRecord);

        // FIXME: Add back pids field in case it was removed
        deserializedRecord = {
            ...deserializedRecord,
            ...(!_isEmpty(savedPidsFieldValue) ? { pids: savedPidsFieldValue } : {}),
        };

        for (let key in this.depositRecordSchema) {
            deserializedRecord = this.depositRecordSchema[key].deserialize(
                deserializedRecord,
                this.defaultLocale
            );
        }
        return deserializedRecord;
    }

    /**
     * Deserialize backend record errors into format compatible with frontend.
     * @method
     * @param {array} errors - array of error objects
     * @returns {object} - object representing errors
     */
    deserializeErrors(errors) {
        let deserializedErrors = {};

        // TODO - WARNING: This doesn't convert backend error paths to frontend
        //                 error paths. Doing so is non-trivial
        //                 (re-using deserialize has some caveats)
        //                 Form/Error UX is tackled in next sprint and this is good
        //                 enough for now.
        for (let e of errors) {
            _set(deserializedErrors, e.field, e.messages.join(' '));
        }

        return deserializedErrors;
    }

    /**
     * Serialize record to send to the backend.
     * @method
     * @param {object} record - in frontend format
     * @returns {object} record - in API format
     *
     */
    serialize(record) {
        // NOTE: cloning nows allows us to manipulate the copy with impunity without
        //       affecting the original
        let originalRecord = _pick(_cloneDeep(record), [
            'access',
            'metadata',
            'id',
            'links',
            'defaultFilePreview',
            'files',
            'pids',
        ]);

        // FIXME: move logic in a more sophisticated PIDField that allows empty values
        // to be sent in the backend
        let savedPidsFieldValue = originalRecord.pids || {};

        let serializedRecord = this.removeEmptyValues(originalRecord);

        for (let key in this.depositRecordSchema) {
            serializedRecord = this.depositRecordSchema[key].serialize(
                serializedRecord,
                this.defaultLocale
            );
        }

        // Remove empty values again because serialization may add some back
        serializedRecord = this.removeEmptyValues(serializedRecord);

        // FIXME: Add back pids field in case it was removed
        serializedRecord = {
            ...serializedRecord,
            ...(!_isEmpty(savedPidsFieldValue) ? { pids: savedPidsFieldValue } : {}),
        };

        // Finally add back 'metadata' if absent
        // We need to do this for backend validation, unless we mark metadata as
        // required in the backend or find another alternative.
        _defaults(serializedRecord, { metadata: {} });

        return serializedRecord;
    }
}
