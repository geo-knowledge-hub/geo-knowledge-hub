..
    This file is part of GEO Knowledge Hub.
    Copyright 2020-2021 GEO Secretariat.

    GEO Knowledge Hub is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.


Changes
=======

Version 1.2.1 (2022-05-25)
--------------------------------

- Fixed ``Additional details`` condition error;
- Fixed ``Geospatial metadata previewer`` div selection; 
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
