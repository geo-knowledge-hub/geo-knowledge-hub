export class ElasticSearchQueryBuilder {
    static buildQueryByKnowledgePackageResource(knowledgePackageId, vocabularyResourceTypes) {
        // building the query search
        const allResourceTypesQuery = vocabularyResourceTypes.map((x) => {
            return `metadata.resource_type.id: "${x.id}"`
        }).join(" OR ");

        return `metadata.related_identifiers.identifier: "${knowledgePackageId}" AND (${allResourceTypesQuery})`
    };
};
