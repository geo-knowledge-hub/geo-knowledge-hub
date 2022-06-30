/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from "lodash/get";
import _set from "lodash/set";
import _cloneDeep from "lodash/cloneDeep";

import { Field } from "./Field";

/**
 * @name VocabularyField
 * @summary Class for Record field associated to controlled vocabularies.
 *
 * @note This class is adapted from the React-Invenio-Deposit
 *       (https://github.com/inveniosoftware/react-invenio-deposit/blob/cafac00f9667d96134d8a1bf4c2abbc285513aed/src/lib/fields/VocabularyField.js#L14).
 */
export class VocabularyField extends Field {

    /**
     * Constructor
     * @param {string} fieldpath Field path into the record object (dot path supported)
     * @param {object} deserializedDefault Default deserialized field value.
     * @param {object} serializedDefault Default serialized field value.
     * @param {string} labelField Name of the property should be used to store the
     *                            label in the result.
     */
    constructor({
        fieldpath,
        deserializedDefault = null,
        serializedDefault = null,
        labelField = 'name',
    }) {
        super({ fieldpath, deserializedDefault, serializedDefault });
        this.labelField = labelField;
    }

    /**
     * @override
     */
    serialize(record) {
        let serializedValue = null;
        let fieldValue = _get(record, this.fieldpath, this.serializedDefault);

        if (fieldValue !== null) {
            serializedValue = Array.isArray(fieldValue)
                ? fieldValue.map((value) => {
                    if (typeof value === 'string') {
                        return { id: value };
                    } else {
                        return {
                            ...(value.id ? { id: value.id } : {}),
                            [this.labelField]: value[this.labelField],
                        };
                    }
                })
                : { id: fieldValue }; // fieldValue is a string
        }

        return _set(
            _cloneDeep(record),
            this.fieldpath,
            serializedValue || fieldValue
        );
    }

    /**
     * @override
     */
    deserialize(record) {
        let deserializedValue = null;

        const deserializator = (value) => value.id; // I don't know about the name...
        const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);

        if (fieldValue !== null) {
            deserializedValue = Array.isArray(fieldValue)
                ? fieldValue.map(deserializator)
                : deserializator(fieldValue);
        }

        return _set(
            _cloneDeep(record),
            this.fieldpath,
            deserializedValue || fieldValue
        )
    }
}

/**
 * @name AllowAdditionsVocabularyField
 * @summary Class for Record field associated to controlled vocabularies
 *         (with custom definitions enabled).
 *
 * @note This class is adapted from the React-Invenio-Deposit
 *       (https://github.com/inveniosoftware/react-invenio-deposit/blob/cafac00f9667d96134d8a1bf4c2abbc285513aed/src/lib/fields/VocabularyField.js#L67).
 */
export class AllowAdditionsVocabularyField extends VocabularyField {
    deserialize(record) {
        const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);

        // from the original implementation class:
        // We deserialize the values in the format
        // {id: 'vocab_id', <labelField>: 'vacab_name'} for controlled values
        // and {<labelField>: 'vocab_name'} for user added entries.
        const deserializer = (value) => ({
            ...(value.id ? { id: value.id } : {}),
            [this.labelField]: value[this.labelField],
        });

        let deserializedValue = null;
        if (fieldValue !== null) {
            deserializedValue = Array.isArray(fieldValue)
                ? fieldValue.map(deserializer)
                : deserializer(fieldValue);
        }
        return _set(
            _cloneDeep(record),
            this.fieldpath,
            deserializedValue || fieldValue
        );
    }
}


/**
 * @name RightsVocabularyField
 * @summary Serialize and deserialize rights field that can contain vocabulary values
 *          and free text but sharing structure with the vocabulary values.
 *
 * @note This class is adapted from the React-Invenio-Deposit
 *       (https://github.com/inveniosoftware/react-invenio-deposit/blob/cafac00f9667d96134d8a1bf4c2abbc285513aed/src/lib/fields/VocabularyField.js#L95).
 */
export class RightsVocabularyField extends VocabularyField {

    constructor({
        fieldpath,
        deserializedDefault = null,
        serializedDefault = null,
        localeFields = [],
    }) {
        super({ fieldpath, deserializedDefault, serializedDefault });

        this.localeFields = localeFields;
    }

    /**
     * @name serialize
     * @summary Serialize a record field.
     *
     * @description Serializes the values in the format:
     *                  {id: 'vocab_id'} for controlled vocabs and
     *                  {
     *                      <field_name>:
     *                        { '<default_locale>: 'field_name'},
     *                     <field_descripton>:
     *                        { <default_locale>: 'field_descripton'}
     *                   }
     *
     * @param {object} record Record to serialize
     * @param {string} defaultLocale Locale.
     */
    serialize(record, defaultLocale) {
        let serializedValue = null;
        const fieldValue = _get(record, this.fieldpath, this.serializedDefault);

        const serializer = (value) => {
            let clonedValue = _cloneDeep(value);
            if ("id" in value) {
                return { id: value.id };
            } else {
                this.localeFields.forEach((field) => {
                    if (field in value) {
                        clonedValue[field] = { [defaultLocale]: value[field] };
                    }
                })
            }

            return clonedValue;
        };

        if (fieldValue !== null) {
            serializedValue = Array.isArray(fieldValue)
                ? fieldValue.map(serializer)
                : serializer(fieldValue);
        }

        return _set(
            _cloneDeep(record), this.fieldpath, serializedValue || fieldValue
        );
    }

    /**
     * @name deserialize
     * @summary Deserialize a serialized record.
     *
     * @description Deserializes the values in the format:
     *                  {id: 'vocab_id'} for controlled vocabs and
     *                  {<field_name>: 'field_name', <field_descripton>: 'field_descripton', ...}
     *              for user added entries
     *
     * @param {object} record Record to eserialize
     * @param {string} defaultLocale Locale.
     */
    deserialize(record, defaultLocale) {
        const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);

        const deserializer = (value) => {
            if ("id" in value) {
                if (typeof value.title === "string") {
                    return value;
                }
                return { id: value.id }
            } else {
                let deserializedValue = _cloneDeep(value);
                this.localeFields.forEach((field) => {
                    if (value[field]) {
                        deserializedValue[field] = value[field][defaultLocale];
                    }
                });
                return deserializedValue;
            }
        };

        let deserializedValue = null;
        if (fieldValue !== null) {
            deserializedValue = Array.isArray(fieldValue)
                ? fieldValue.map(deserializer)
                : deserializer(fieldValue)
        }

        return _set(
            _cloneDeep(record), this.fieldpath, deserializedValue || fieldValue
        )
    }
}
