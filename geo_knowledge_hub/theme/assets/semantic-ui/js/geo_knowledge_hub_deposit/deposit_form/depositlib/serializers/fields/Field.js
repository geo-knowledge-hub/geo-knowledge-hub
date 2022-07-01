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


/**
 * @name Field
 * @summary Base field class.
 *
 * @note This class is adapted from the React-Invenio-Deposit
 *       (https://github.com/inveniosoftware/react-invenio-deposit/blob/cafac00f9667d96134d8a1bf4c2abbc285513aed/src/lib/fields/Field.js#L12).
 */
export class Field {

    /**
     * @param {string} fieldpath Field path into the record object (dot path supported)
     * @param {object} deserializedDefault Default deserialized field value.
     * @param {object} serializedDefault Default serialized field value.
     *
     * @note  Both `deserializedDefault` and `serializedDefault` are used when the value
     *        in `fieldpath` is not available.
     */
    constructor({
        fieldpath,
        deserializedDefault = null,
        serializedDefault = null,
        allowEmpty = false
    }) {
        this.fieldpath = fieldpath;
        this.serializedDefault = serializedDefault;
        this.deserializedDefault = deserializedDefault;
        this.allowEmpty = allowEmpty;
    }

    /**
     * Serialize a record field.
     * @param {object} record Record object
     * @returns object Record Object with field serialized.
     */
    serialize(record) {
        const fieldValue = _get(record, this.fieldpath, this.serializedDefault);

        if (fieldValue !== null) {
            return _set(_cloneDeep(record), this.fieldpath, fieldValue);
        }

        return record;
    }

    /**
     * Deserialize a record field.
     * @param {object} record
     */
    deserialize(record) {
        const fieldValue = _get(record, this.fieldpath, this.deserializedDefault);

        if (fieldValue !== null) {
            return _set(_cloneDeep(record), this.fieldpath, fieldValue);
        }

        return record;
    }
}
