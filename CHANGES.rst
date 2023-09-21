..
    This file is part of GEO Knowledge Hub.
    Copyright 2020-2021 GEO Secretariat.

    GEO Knowledge Hub is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.


Changes
=======

Version 1.6.3 (2023-09-21)
---------------------------

- General changes

  - **Landing page**:

    - Added locations attribute visualization support based on `Invenio Geographic Components React (v0.2.4) <https://github.com/geo-knowledge-hub/invenio-geographic-components-react/blob/master/CHANGES.md#version-024-2023-09-14>`_ (`#249 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/249>`_)

    - Improved ``Related links`` component behavior on mobile based on `GEO Components React components (v0.5.2) <https://github.com/geo-knowledge-hub/geo-components-react/blob/master/CHANGES.md#version-052-2023-09-14>`_ (`#318 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/318>`_)


Version 1.6.2 (2023-09-01)
---------------------------

- General changes

  - **Landing page**:

    - Updated ``Related Packages`` component based on `GEO Components React components (v0.5.1) <https://github.com/geo-knowledge-hub/geo-components-react/blob/master/CHANGES.md#version-051-2023-08-31>`_.


- Introduced features

  - **Front page**:

    - Added new ``User management`` option based on `GEO User Dashboard (v0.1.0) <https://github.com/geo-knowledge-hub/geo-user-dashboard/blob/main/CHANGES.md#version-010-20230830>`_ (`#313 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/313>`_)

  - **Landing page**:

    - Added new ``Request training`` option. (`#305 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/305>`_)


Version 1.6.1 (2023-08-22)
---------------------------

- General changes

  - **Front page**:

    - Reviewed page structure based on new UI components from `GEO Components React package (v0.5.0) <https://github.com/geo-knowledge-hub/geo-components-react/tree/b-0.5>`_ (`#213 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/213>`_)

  - **Landing page**:

    - Added new User stories component based on `GEO Components React components (v0.5.0) <https://github.com/geo-knowledge-hub/geo-components-react/tree/b-0.5>`_.

- Introduced features

  - **Front page**:

    - Added new ``Upcoming training and events`` component based on `GEO Components React components (v0.5.0) <https://github.com/geo-knowledge-hub/geo-components-react/tree/b-0.5>`_ (`#306 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/306>`_)


Version 1.6.0 (2023-06-10)
---------------------------

- General changes

  - **Front page**:

    - Replace the `Overview page <https://gkhub.earthobservations.org/doc/>`_ with the new documentation page overview (`#258 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/258>`_) (Based on `GEO Knowledge Hub Docs <https://github.com/geo-knowledge-hub/geo-knowledge-hub-docs>`_).

  - **Vocabulary**:

    - Updated ``Relation types`` vocabulary based on InvenioRDM updates.

  - **Landing page**:

    - ``Related works`` field labels renamed to ``Related links`` (`#275 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/275>`_);
    - Added new ``Related links`` visualization (`#275 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/275>`_);
    - Added DOI solver for Packages (`#286 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/286>`_);

    - Introduced initial integration with `GEO Knowledge Hub Feed <https://github.com/geo-knowledge-hub/geo-knowledge-hub-feed>`_ using `Invenio Requests <https://github.com/inveniosoftware/invenio-requests>`_ (`#203 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/203>`_)

      - Added ``Available Requests`` feature for Knowledge Packages (`#284 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/pull/284>`_).

    - Fixed error in state handling on the Knowledge Package deposit page;

    - Added validations to avoid map rendering when geometries are not available in the record ``features field``.

  - **Communities**:

    - Fixed rendering error with Knowledge Packages on the community requests page (`#295 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/pull/295>`_).

  - **E-mail**:

    - New e-mail templates based on `Postmark Transactional Email Templates <https://github.com/activecampaign/postmark-templates>`_ (`#292 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/pull/292>`_ and `#293 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/pull/293>`_).

- Infrastructure

  - Replaced ``CentOS`` image with ``AlmaLinux`` (`#277 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/277>`_, `#280 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/280>`_)

    - Python version upgraded  to ``3.9.0``;
    - Node JS version upgraded to version ``16`` (`#278 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/278>`_).

  - Reviewed CSP policies;

  - Replaced ``AddThis`` with ``AddToAny`` (`#298 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/298>`_);

  - Added prefix to the search indices (`#285 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/285>`_).


Version 1.5.0 (2023-03-17)
---------------------------

- General updates

  - Updated InvenioRDM to version 11 (`#215 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/215>`_).

- Introduced features

  - **Front page**:

    - Reviewed the Latest addition implementation and component based on InvenioRDM features (`#219 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/219>`_);
    - Added Featured communities carousel based on InvenioRDM features (`#219 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/219>`_);
    - Added reference to the GEO Knowledge Hub guidelines in the footer section (`#273 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/273>`_).

  - **Vocabulary**:

    - Review and update the GEO Work Programme vocabulary based on the `GEO Work Programme activities for 2023-2025 <https://www.earthobservations.org/geo_wp_23_25.php>`_ (`#206 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/206>`_).

  - **Deposit**:

    - Added import metadata feature to enable users to load metadata from packages into resources (`#220 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/220>`_);
    - Implemented a navigable previewer for packages, allowing the users to explore a package and its resources in the preview mode (`#217 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/217>`_, `#221 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/221>`_, `#232 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/pull/232>`_);
    - Created a ``GEO Recommended`` section in the licenses modal (`#227 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/227>`_).

  - **Landing page**:

    - Added a new component to view ``Related works``;
    - Added new component to visualize ``Associated Knowledge Packages`` (`#235 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/235>`_, `#253 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/253>`_).

  - **Communities**:

    - Removed "New community" button from the search community page (`#256 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/256>`_);
    - Configured new facets for the Community search result page (`#262 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/262>`_);
    - Reviewed the approach used to configure the community policy (`#268 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/pull/268>`_).

  - **Management**:

    - Enabled the Administration page using the InvenioRDM 11 features.

- Infrastructure

  - OpenSearch (``1.3.x``) was replaced with OpenSearch (``2.3.x``) (`#215 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/215>`_);

In addition to the features and changes mentioned above, this new version includes improvements and bug fixes in the Landing Page and the Deposit interface. For more information, see the complete list of issues solved in `milestone v1.5.0 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/milestone/7?closed=1>`_.

Version 1.4.1 (2023-01-10)
---------------------------

- Added ``Method (Publication)`` in the Resource Type vocabulary;
- Introduced `MailHog <https://github.com/mailhog/MailHog>`_ in the development services;
- Fixed minor bugs in the interface

  - DOI modal not visible (`#158 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/158>`_);
  - License modal not visible (`#194 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/194>`_).


Version 1.4.0 (2023-01-05)
---------------------------

- Repository review

  - The modules used to customize the InvenioRDM now follow the same structure used in the `Invenio App RDM <https://github.com/inveniosoftware/invenio-app-rdm>`_.

- Introduced features

  - **Vocabulary**:

    - Review and organize the Licenses vocabularies based on the GEO Data Sharing principles (`#138 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/138>`_).

  - **Packages API**:

    - API to manage packages and their relation with resources;
    - Packages API are implemented with the `GEO RDM Records <https://github.com/geo-knowledge-hub/geo-rdm-records>`_.

  - **Communities**:

    - Feature to enable users to create communities around a specific topic (e.g., ``Project``, ``Research topic``);
    - Communities feature were implemented based on the Invenio RDM 9.0 features and customizations made for the `Invenio RDM Records <https://github.com/geo-knowledge-hub/geo-rdm-records>`_ with GEO RDM Records.

  - **Comments**:

    - Introduced a comments system to enable users to create ``Feedback`` and make ``Comments`` about the shared content;
    - Comments features were implemented with the `GEO Comments <https://github.com/geo-knowledge-hub/geo-comments>`_ replacing the Isso system (`#130 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/130>`_).

  - **Deposit**:

    - Added a new deposit interface to make it easier to users deposit packages and resources;
    - Added email field for Creators and Contributors in the Deposit interface;
    - Increased the Upload size on the deposit interface (now users can upload ``15 GB`` of data).

  - **Search**:

    - Added new endpoint to enable users to search for ``Packages`` and ``Resources`` simultaneously;
    - New search feature was implemented based on the GEO RDM Records.

  - **OAI-PMH**

    - Configured ``Invenio OAI Server`` to search for ``Packages`` and ``Resources`` simultaneously (`#85 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/85>`_).


- Infrastructure

  - Elasticsearch (``v7.10``) was replaced with OpenSearch (``1.3.x``) (`#175 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/175>`_);
  - Removed Isso system from the GEO Knowledge Hub services (`#173 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/173>`_).

Version 1.3.2 (2022-07-21)
--------------------------

- Added improvements in the build script;
- Updated ``GEO Components React`` to version `v0.4.2 <https://github.com/geo-knowledge-hub/geo-components-react/releases/tag/v0.4.2>`_;

Version 1.3.1 (2022-07-20)
--------------------------

- Build script fixed (`#117 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/117>`_);
- Fixed minor bugs in the interface

  - Geo Identifiers selection error: Fixed with the update of the `Invenio Geographic Components React package <https://github.com/geo-knowledge-hub/invenio-geographic-components-react>`_ to version `0.2.1 <https://github.com/geo-knowledge-hub/invenio-geographic-components-react/releases/tag/v0.2.1>`_;
  - Subjects selection error: Fixed with the update of the `GEO Components React package <https://github.com/geo-knowledge-hub/geo-components-react.git>`_ to version `0.4.1 <https://github.com/geo-knowledge-hub/geo-components-react/releases/tag/v0.4.1>`_.


Version 1.3.0 (2022-07-18)
--------------------------------

- Repository review

  - Added the InvenioRDM base files from the GEO Knowledge Hub RT;

    - Vocabularies;
    - Dependencies;
    - Environment files (Dockerfile, Docker Compose, Nginx, Builder);
    - Configuration file (Invenio configuration file, Isso configuration file).

  - Installation scripts revised (`#91 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/91>`_).

- Introduced features

  - **Vocabulary**:

    - Convention concept in the Engagement Priorities (`#82 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/82>`_);
    - Target audience updated with new items (`#80 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/80>`_, `#86 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/86>`_);
    - Geographic Identifiers vocabulary added via Integration with the Invenio Geographic Identifiers module (`#99 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/99>`_);

  - **Spatial support** (`#52 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/52>`_):

    - Search filter for records with spatial metadata field defined;
    - Introduced new component to visualize the spatial metadata in the Record Landing page (`#53 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/53>`_);

  - **Search components**

    - Initial Advanced search component (Front page) (`#84 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/84>`_)

      - Support for ``Basic`` and ``Spatial``.

    - Quick Search (Front page):

      - Added the Convention search (`#79 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/79>`_).

- Theme, Build system and dependencies

  - Dependencies

    - The GEO Deposit React was replaced by `GEO Components React <https://github.com/geo-knowledge-hub/geo-components-react>`_;

  - Theme

    - Added custom `webpack <https://webpack.js.org/>`_ script to build the project theme.


Version 1.2.1 (2022-05-25)
--------------------------------

- Fixed ``Additional details`` condition error;
- Fixed ``Geospatial metadata previewer`` div selection;
- Updated ``GEO Components React`` to version `v0.3.2 <https://github.com/geo-knowledge-hub/geo-components-react/releases/tag/v0.3.2>`_;
- Updated the local cache of resource types available in the GEO Knowledge Hub.

Version 1.2.0 (2022-05-24)
--------------------------------

- Added visibility configuration to the elements of the Knowledge Package in the Deposit Interface;

- Added the GEO Work Programme and Target Audience to the Knowledge Resource interface;

- Improvements in the Deposit interface experience:

  - Avoid data lost in the Knowledge Resource Modal when the user clicks in a place outside the modal;
  - Revised the toast message about the publication status. The toast implementation is now implemented with the `React Semantic Toasts <https://www.npmjs.com/package/react-semantic-toasts>`_ package.
- The search result now presents the GEO Work Programme Badge. This modification affects all GEO Knowledge Hub pages which contain a search result (e.g., Deposit page, Record Landing Page, Record search Page).

Version 1.1.1 (2022-05-22)
--------------------------------

- Added social share button using `AddThis <https://www.addthis.com/>`_ (e.g., Twitter, Facebook, Email) (`#58 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/58>`_);

- Webpack entries review (`#57 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/57>`_) to reduce the size of the scripts loaded on the GEO Knowledge Hub pages;

- Updated the record landing page with the following new components:

  - ``Related resource table`` (based on GEO Components React `v0.3.0 <https://github.com/geo-knowledge-hub/geo-components-react/releases/tag/v0.3.0>`_). Using this new component, the elements associated with a Knowledge Package are now presented in a table with full-text search and faceted search operations;
  - ``Version dropdown menu`` (based on `Invenio App RDM components <https://github.com/inveniosoftware/invenio-app-rdm>`_). This component replaces the original InvenioRDM versions component with a dropdown menu;
  - ``Engagement Priorities Carousel`` (based on GEO Components React `v0.3.0 <https://github.com/geo-knowledge-hub/geo-components-react/releases/tag/v0.3.0>`_). The carousel now uses lazy load operation and the Semantic UI theme.

- Updated the front page carousel using lazy load operations and Semantic UI theme (based on GEO Components React `v0.3.0 <https://github.com/geo-knowledge-hub/geo-components-react/releases/tag/v0.3.0>`_)

Version 1.1.1-alpha (2022-05-09)
--------------------------------

- Revised the build system of the webpack (Fixes `#54 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/54>`_) and added the React.js dependencies needed for building the application (Fixes `#56 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/56>`_).

Version 1.1.0-alpha (2022-04-29)
--------------------------------

- Added initial support for the Geospatial metadata visualization on the Record Landing Page (Part of `#52 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/52>`_ and `#53 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/53>`_).

Version 1.0.1 (2022-04-28)
---------------------------

- Fixing labels used to define engagement priorities (Main themes and subtopics)


Version 1.0.0 (2022-04-24)
---------------------------

- Based on `InvenioRDM 8.0 <https://inveniordm.docs.cern.ch/releases/versions/version-v8.0.0/>`_.

- Customization of InvenioRDM pages:

  - Engagement Priorities Carousel on frontpage with search support (based on `geo-components-react <https://github.com/geo-knowledge-hub/geo-components-react>`_);

  - New frontpage organization to support multiple contents;

  - Reorganizing the icons on the page headers;

  - Engagement Priorities support on Record Landing page (Sidebar) (based on `geo-components-react <https://github.com/geo-knowledge-hub/geo-components-react>`_);

  - Users Stories Carousel support on Record Landing Page (`#39 <https://github.com/geo-knowledge-hub/geo-knowledge-hub/issues/39>`_);

  - GEO Engagement Priorities association as a label on the Record Landing Page (based on `geo-components-react <https://github.com/geo-knowledge-hub/geo-components-react>`_);

  - New fields on the deposit page (based on `geo-deposit-react <https://github.com/geo-knowledge-hub/geo-deposit-react>`_);

    - Engagement Priorities Field;

    - GEO Work Programme Activities Field;

    - Target Audiences field.

- Improvements in the code organization;

- Custom facet behavior based on `geo-rdm-records features <https://github.com/geo-knowledge-hub/geo-rdm-records>`_;

- Assets now are provided by a specialized library:  `geo-assets <https://github.com/geo-knowledge-hub/geo-assets>`_;

- Security and other configurations are defined on a specialized library:  `geo-config <https://github.com/geo-knowledge-hub/geo-config>`_;

Version 0.8.0 (2021-11-24)
---------------------------

- Based on `InvenioRDM 6.0 <https://inveniordm.docs.cern.ch/releases/versions/version-v6.0.0/>`_.

- Customization of InvenioRDM pages:

  - Invenio deposit page with knowledge package workflow upload.

  - Add ``Knowledge Package`` and ``Knowledge Resource`` upload links in header pages.

- Updates:

  - latest additions displays last record version.

  - user control based on invenio roles.

  - DOI minting is hidden from users.


Version 0.6.0 (2021-10-07)
----------------------------


- Based on `InvenioRDM 6.0 <https://inveniordm.docs.cern.ch/releases/versions/version-v6.0.0/>`_.

- Customization of InvenioRDM pages:

  - frontpage with latest additions.
  - record search page with keywords filter.
  - record landing page with knowledge package components and Q&A session.

- User control based on invenio actions.
