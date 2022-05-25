/*
 * This file is part of geo-knowledge-hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * geo-knowledge-hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

/**
 * Temporary solution to avoid many queries
 * to elasticsearch when user are loading the landing page.
 *
 * In the future, we will change this.
 */
export const resourceTypeDefinitions = [
  {
    icon: "file alternate",
    id: "publication-annotationcollection",
    subtype_name: "Annotation collection",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-conferencepaper",
    subtype_name: "Conference paper",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-datamanagementplan",
    subtype_name: "Data management plan",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-patent",
    subtype_name: "Patent",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-book",
    subtype_name: "Book",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-milestone",
    subtype_name: "Project milestone",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-softwaredocumentation",
    subtype_name: "Software documentation",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-taxonomictreatment",
    subtype_name: "Taxonomic treatment",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-technicalnote",
    subtype_name: "Technical note",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-deliverable",
    subtype_name: "Project deliverable",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-report",
    subtype_name: "Report",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-thesis",
    subtype_name: "Thesis",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-other",
    subtype_name: "Other",
    type_name: "Publication",
  },
  {
    icon: "table",
    id: "dataset-datacube",
    subtype_name: "Data Cube",
    type_name: "Dataset",
  },
  {
    icon: "columns",
    id: "poster",
    subtype_name: "",
    type_name: "Poster",
  },
  {
    icon: "file alternate",
    id: "publication-workingpaper",
    subtype_name: "Working paper",
    type_name: "Publication",
  },
  {
    icon: "table",
    id: "dataset",
    subtype_name: "",
    type_name: "Dataset",
  },
  {
    icon: "group",
    id: "presentation",
    subtype_name: "",
    type_name: "Presentation",
  },
  {
    icon: "table",
    id: "dataset-samples",
    subtype_name: "Samples",
    type_name: "Dataset",
  },
  {
    icon: "table",
    id: "dataset-product",
    subtype_name: "Output Product",
    type_name: "Dataset",
  },
  {
    icon: "table",
    id: "dataset-stacitems",
    subtype_name: "STAC Items",
    type_name: "Dataset",
  },
  {
    icon: "table",
    id: "dataset-insitu",
    subtype_name: "in-situ",
    type_name: "Dataset",
  },
  {
    icon: "table",
    id: "dataset-lulcmap",
    subtype_name: "LULC Map",
    type_name: "Dataset",
  },
  {
    icon: "chart bar outline",
    id: "image-figure",
    subtype_name: "Figure",
    type_name: "Image",
  },
  {
    icon: "table",
    id: "dataset-aoi",
    subtype_name: "Area of Interest",
    type_name: "Dataset",
  },
  {
    icon: "chart bar outline",
    id: "image",
    subtype_name: "",
    type_name: "Image",
  },
  {
    icon: "chart bar outline",
    id: "image-drawing",
    subtype_name: "Drawing",
    type_name: "Image",
  },
  {
    icon: "chart bar outline",
    id: "image-plot",
    subtype_name: "Plot",
    type_name: "Image",
  },
  {
    icon: "chart bar outline",
    id: "image-diagram",
    subtype_name: "Diagram",
    type_name: "Image",
  },
  {
    icon: "code",
    id: "software",
    subtype_name: "",
    type_name: "Software",
  },
  {
    icon: "chart bar outline",
    id: "image-photo",
    subtype_name: "Photo",
    type_name: "Image",
  },
  {
    icon: "film",
    id: "video",
    subtype_name: "",
    type_name: "Video/Audio",
  },
  {
    icon: "chart bar outline",
    id: "image-other",
    subtype_name: "Other",
    type_name: "Image",
  },
  {
    icon: "code",
    id: "software-compenv",
    subtype_name: "Computational Environment",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-source",
    subtype_name: "Source Code",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-awsami",
    subtype_name: "AWS AMI",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-jupyter",
    subtype_name: "Jupyter Notebook",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-rmarkdown",
    subtype_name: "R Markdown",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-dockerimage",
    subtype_name: "Docker Image",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-dockerscript",
    subtype_name: "DockerFile",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-webportal",
    subtype_name: "Web Portal",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-datacatalog",
    subtype_name: "Catalog Service",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-webcatalog",
    subtype_name: "Web Catalog",
    type_name: "Software",
  },
  {
    icon: "map",
    id: "software-ogc-wms",
    subtype_name: "OGC Web Map Service",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-dataservice",
    subtype_name: "Data Service",
    type_name: "Software",
  },
  {
    icon: "map",
    id: "software-ogc-wfs",
    subtype_name: "OGC Web Feature Service",
    type_name: "Software",
  },
  {
    icon: "code",
    id: "software-executable",
    subtype_name: "Software Executable",
    type_name: "Software",
  },
  {
    icon: "map",
    id: "software-ogc-wcs",
    subtype_name: "OGC Web Coverage Service",
    type_name: "Software",
  },
  {
    icon: "graduation",
    id: "lesson",
    subtype_name: "",
    type_name: "Lesson",
  },
  {
    icon: "map",
    id: "software-geonode",
    subtype_name: "GeoNode",
    type_name: "Software",
  },
  {
    icon: "map",
    id: "software-ogc-wmts",
    subtype_name: "OGC Web Map Tile Service",
    type_name: "Software",
  },
  {
    icon: "asterisk",
    id: "knowledge",
    subtype_name: "",
    type_name: "Knowledge Package",
  },
  {
    icon: "asterisk",
    id: "other",
    subtype_name: "",
    type_name: "Other",
  },
  {
    icon: "asterisk",
    id: "publication-trainingmaterial",
    subtype_name: "Training material",
    type_name: "Publication",
  },
  {
    icon: "group",
    id: "user-story",
    subtype_name: "",
    type_name: "User Story",
  },
  {
    icon: "file alternate",
    id: "publication-article",
    subtype_name: "Journal article",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-section",
    subtype_name: "Book section",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication",
    subtype_name: "",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-preprint",
    subtype_name: "Preprint",
    type_name: "Publication",
  },
  {
    icon: "file alternate",
    id: "publication-proposal",
    subtype_name: "Proposal",
    type_name: "Publication",
  },
];
