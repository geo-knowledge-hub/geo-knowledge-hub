..
    This file is part of GEO Knowledge Hub.
    Copyright 2020-2021 GEO Secretariat.

    GEO Knowledge Hub is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.


Changes
=======

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
