..
    This file is part of GEO Knowledge Hub.
    Copyright 2020-2021 GEO Secretariat.

    GEO Knowledge Hub is free software; you can redistribute it and/or modify it
    under the terms of the MIT License; see LICENSE file for more details.


Developing the GEO Knowledge Hub InvenioRDM Extension
=====================================================

Install
-------

Install the package with the `docs`, `elasticsearch`, and a `database` dependencies:

.. code-block:: console

    pip install -e .[docs, <[mysql|postgresql|sqlite]>, elasticsearch7]


Tests
-----

After installing the package and its dependencies, if you want to test the code, install the `tests` dependencies:

.. code-block:: console

    pip install -e .[tests]

Now, you can run the tests:

.. code-block:: console

    ./run-tests.sh
