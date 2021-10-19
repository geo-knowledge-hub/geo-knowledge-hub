export class LibraryVocabularyHandler {
    constructor(vocabularies) {

        this.vocabularies = {
            metadata: {
                ...vocabularies,

                creators: {
                    ...vocabularies.creators,
                    type: [
                        { text: "Person", value: "personal" },
                        { text: "Organization", value: "organizational" },
                    ]
                },

                contributors: {
                    ...vocabularies.creators,
                    type: [
                        { text: "Person", value: "personal" },
                        { text: "Organization", value: "organizational" },
                    ]
                },

                // TODO: Replace with an API backend
                funding: {
                    funder: [
                        {
                            name: "National Institutes of Health (US)",
                            identifier: "funder1",
                            scheme: "funderScheme1",
                        },
                        {
                            name: "European Commission (EU)",
                            identifier: "funder2",
                            scheme: "funderScheme2",
                        },
                    ],
                    award: [
                        {
                            title: "CANCER &AIDS DRUGS--PRECLIN PHARMACOL/TOXICOLOGY",
                            number: "N01CM037835-016",
                            identifier: "awardA",
                            scheme: "awardSchemeA",
                            parentScheme: "funderScheme1",
                            parentIdentifier: "funder1",
                        },
                        {
                            title:
                                "Beyond the Standard Model at the LHC and with Atom Interferometers.",
                            number: "228169",
                            identifier: "awardB1",
                            scheme: "awardSchemeB",
                            parentScheme: "funderScheme2",
                            parentIdentifier: "funder2",
                        },
                        {
                            title: "ENvironmental COnditions in GLAucoma Patients",
                            number: "747441",
                            identifier: "awardB2",
                            scheme: "awardSchemeB",
                            parentScheme: "funderScheme2",
                            parentIdentifier: "funder2",
                        },
                    ],
                },

                identifiers: {
                    resource_type: vocabularies.identifiers.resource_type,
                    scheme: [
                        { text: "ARK", value: "ark" },
                        { text: "ARXIV", value: "arxiv" },
                        { text: "BIBCODE", value: "bibcode" },
                        { text: "DOI", value: "doi" },
                        { text: "EAN13", value: "ean13" },
                        { text: "EISSN", value: "eissn" },
                        { text: "HANDLE", value: "handle" },
                        { text: "IGSN", value: "igsn" },
                        { text: "ISBN", value: "isbn" },
                        { text: "ISSN", value: "issn" },
                        { text: "ISTC", value: "istc" },
                        { text: "LISSN", value: "lissn" },
                        { text: "LSID", value: "lsid" },
                        { text: "PMID", value: "pmid" },
                        { text: "PURL", value: "purl" },
                        { text: "UPC", value: "upc" },
                        { text: "URL", value: "url" },
                        { text: "URN", value: "urn" },
                        { text: "W3ID", value: "w3id" },
                    ],
                    relations: vocabularies.identifiers.relations,
                },
            },
        };
    }

    /**
     * Filter a specific resource type.
     * @param {string} type resource Type
     * @returns object with the resource type properties or null
     */
    filterResourceByType = (type) => {
        return this.vocabularies.metadata.resource_type.filter((value) => {
            if (value.type_name === type) return value;
        });
    };

    /**
     * Filter a specific resource id.
     * @param {string} id resource id
     * @returns object with the resource type properties or null
     */
     filterResourceById = (id) => {
        return this.vocabularies.metadata.resource_type.filter((value) => {
            if (value.id === id) return value;
        });
    };

    /**
   * Filter resource types by removing the invalid types
   * @param {Array} types Array with the Resource types that should be not returned
   * @returns {Array} Array with all valid types (where valid is valus that is not included in `types`)
   */
    filterResourcesByInvalidTypes = (types) => {
        return this.vocabularies.metadata.resource_type.filter((value) => {
            return !types.includes(value.type_name);
        });
    }
};
