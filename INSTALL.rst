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


Roles
-----------------

To use the available features in this extension, you will need to create three separate roles. Each role represents a type of user, which has different privileges. The table below summarizes each of the roles and the operations they can perform.

.. tip::

    Therefore, to use GEO Knowledge Hub, assign the roles correctly to the respective users.


+-----------------+---------------------------------------------+------------------------+
|                 |                                             |       Permissions      |
+-----------------+---------------------------------------------+------+--------+--------+
|    Role name    |                 Description                 | View | Create | Manage |
+-----------------+---------------------------------------------+------+--------+--------+
|  geo-community  | User with privileges to access the system.  |   X  |        |        |
|                 |    Can make comments and create feedbacks   |      |        |        |
+-----------------+---------------------------------------------+------+--------+--------+
|   geo-provider  | User with privileges to create new records  |   X  |    X   |        |
|                 |           in the GEO Knowledge Hub          |      |        |        |
+-----------------+---------------------------------------------+------+--------+--------+
| geo-secretariat |                  Admin user                 |   X  |    X   |    X   |
+-----------------+---------------------------------------------+------+--------+--------+


.. tip::


        You can find a complete description of the policies used (Extracted from `Invenio RDM <https://inveniordm.docs.cern.ch/>`_) in the `repository of the extension <https://github.com/geo-knowledge-hub/geo-knowledge-hub>`_.


To add each of the listed roles, as well as their respective accesses, the following commands can be used:

``GEO Community``::

    invenio roles create geo-community
    invenio access allow geo-community-access role geo-community


``GEO Knowledge Provider``:

    invenio roles create geo-provider
    invenio access allow geo-provider-access role geo-provider

``GEO Secretariat (Admin)``:

    invenio roles create geo-secretariat
    invenio access allow geo-provider-access role geo-secretariat
    invenio access allow geo-secretariat-access role geo-secretariat


You can now use the extension's permission settings to access resources (``geo_knowledge_hub.security.policies.GeoRecordPermissionPolicy``). If you have any questions, please open an issue.
