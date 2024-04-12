/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2024 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from "react";
import PropTypes from "prop-types";
import { i18next } from "@translations/geo_knowledge_hub/i18next";


/**
 * Show metadata from a community associated with a record.
 *
 * @note This code was adapted from Invenio App RDM before the launch of InvenioRDM v12
 * @param community
 * @returns {JSX.Element}
 * @constructor
 */
export const DisplayPartOfCommunity = ({ community }) => {
  // In InvenioRDM v11, the APIs support adding one community per record.
  // As the data model supports multiple communities, in InvenioRDM v12,
  // this will be changed.
  // ToDo: Update component after InvenioRDM v12
  return (
    <>
      {i18next.t("Part of ")}
      <a href={`/communities/${community.slug}`}>
        {community.metadata?.title}
      </a>
    </>
  )
}

DisplayPartOfCommunity.propTypes = {
  community: PropTypes.object.isRequired,
};
