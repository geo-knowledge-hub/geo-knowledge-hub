/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from 'lodash/get';
import _pick from 'lodash/pick';
import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';

import { Field } from './Field';

/**
 * @name SchemaField
 * @summary Class for Record Schema field.
 *
 * @note This class is adapted from React-Invenio-Deposit
 *       (https://github.com/inveniosoftware/react-invenio-deposit/blob/cafac00f9667d96134d8a1bf4c2abbc285513aed/src/lib/fields/SchemaField.js#L14)
 * @note As described in the original implementation, this component is so far only for
 *       list subfields, since the use case of a single object with schema has not arisen yet.
 */
export class SchemaField extends Field {

    constructor({
        fieldpath,
        schema,
        deserializedDefault = [],
        serializedDefault = [],
    }) {
        super({ fieldpath, deserializedDefault, serializedDefault });

        this.schema = schema;
        this.schemaKeys = Object.keys(this.schema);
    }

    /**
     * @name serialize
     * @summary Serialize a record deserialized (in frontend format).
     *
     * @description Serialize frontend field given by `this.fieldpath` from `deserialized`
     *              object into format compatible with backend using `this.schema`.
     *
     * @param {object} deserialized in front format.
     * @param {object} serialized  in API format.
     */
    serialize(deserialized) {
        const fieldValues = _get(
            deserialized, this.fieldpath, this.serializedDefault
        );

        const serializedElements = fieldValues.map((value) => {
            let serializedElement = _pick(value, this.schemaKeys);
            this.schemaKeys.forEach((key) => {
                serializedElement = this.schema[key].serialize(serializedElement);
            });
            return serializedElement;
        });

        if (serializedElements !== null) {
            return _set(_cloneDeep(deserialized), this.fieldpath, serializedElements);
        }
        return serializedElements;
    }

    /**
     * @name deserialize
     * @summary Deserialize a record serialized (in API format).
     *
     * @description Deserialize backend field given by `this.fieldpath` from `serialized`
     *              object into format compatible with frontend using `this.schema`.
     *
     * @param {object} serialized in API format
     * @param {object} deserialized in front format.
     */
    deserialize(serialized) {
        const fieldValues = _get(
            serialized, this.fieldpath, this.deserializedDefault
        );

        const deserializedElements = fieldValues.map((value, i) => {
            let deserializedElement = _pick(value, this.schemaKeys);
            this.schemaKeys.forEach((key) => {
                deserializedElement = this.schema[key].deserialize(deserializedElement);
            })

            deserializedElement.__key = i;
            return deserializedElement;
        });

        return _set(
            _cloneDeep(serialized), this.fieldpath, deserializedElements
        );
    }

}
