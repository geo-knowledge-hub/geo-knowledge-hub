import {
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
        default:
            return state;
    }
};
