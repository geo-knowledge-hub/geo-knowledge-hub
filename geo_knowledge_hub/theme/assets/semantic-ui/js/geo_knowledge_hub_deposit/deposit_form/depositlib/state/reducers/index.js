/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import {
    ACTION_SAVE_KNOWLEDGE_ENABLE,
    ACTION_SAVE_KNOWLEDGE_DISABLE,

    ACTION_SAVE_KNOWLEDGE_PACKAGE,

    ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED,
    ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED_FINISH
} from "../types";

export default (state = {}, action) => {
    switch (action.type) {
        case ACTION_SAVE_KNOWLEDGE_PACKAGE:
            return {
                ...state,
                knowledgePackage: action.payload.knowledgePackage
            };
        case ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED:
            return {
                ...state,
                resourcePublishIsPublished: true
            };
        case ACTION_KPACKAGE_RESOURCE_PUBLISH_SUCCEEDED_FINISH:
            return {
                ...state,
                resourcePublishIsPublished: false
            };
        case ACTION_SAVE_KNOWLEDGE_ENABLE:
            return {
                ...state,
                knowledgeResourceIsSubmitted: true
            };
        case ACTION_SAVE_KNOWLEDGE_DISABLE:
            return {
                ...state,
                knowledgeResourceIsSubmitted: false
            }
        default:
            return state;
    }
};