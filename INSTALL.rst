..
    This file is part of GEO Knowledge Hub.
    Copyright 2020-2021 GEO Secretariat.

    GEO Knowledge Hub is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.


Install GEO Knowledge Hub InvenioRDM Extension
==============================================


In order to install this extension you will need the GEO Knowledge Hub **runtime** installed. If you do not have it yet, plase, refer to its `install guide <https://github.com/geo-knowledge-hub/geo-knowledge-hub-rt/blob/master/INSTALL.rst>`_ before proceeding.


Use ``git`` to clone the extension software repository::

    git clone https://github.com/geo-knowledge-hub/geo-knowledge-hub.git


.. tip::

    Let's assume you have cloned th above repository to ``/path/to-your/geo-knowledge-hub/geo-knowledge-hub`` and the runtime is located at ``/path/to-your/geo-knowledge-hub-rt``.


Enter the GEO Knowledge Hub **runtime** directory and use ``invenio-cli`` to install the package from the cloned repository::

    cd  /path/to-your/geo-knowledge-hub-rt

    invenio-cli packages install /path/to-your/geo-knowledge-hub/geo-knowledge-hub

