/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

export class ElasticSearchQueryBuilder {
    static buildQueryByKnowledgePackageResource(knowledgePackageId, vocabularyResourceTypes) {
        // building the query search
        const allResourceTypesQuery = vocabularyResourceTypes.map((x) => {
            return `metadata.resource_type.id: "${x.id}"`
        }).join(" OR ");

        return `metadata.related_identifiers.identifier: "${knowledgePackageId}" AND (${allResourceTypesQuery})`
    };
};
