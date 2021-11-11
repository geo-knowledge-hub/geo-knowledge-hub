#
# geo-knowledge-hub-ext is free software; you can redistribute it and/or
# modify it under the terms of the MIT License; see LICENSE file for more
# details.

"""GEO Knowledge Hub Security Policies"""

from invenio_communities.communities.services.permissions import CommunityPermissionPolicy
from invenio_rdm_records.services.permissions import RDMRecordPermissionPolicy
from invenio_records_permissions.generators import SystemProcess

from .generators import GeoKnowledgeProvider
from .generators import GeoSecretariat


class GeoRecordPermissionPolicy(RDMRecordPermissionPolicy):
    """Access control configuration for records.
    """

    #
    # Records
    #
    can_create = [
        SystemProcess(),
        GeoSecretariat(),
        GeoKnowledgeProvider()
    ]


class GeoCommunityPermissionPolicy(CommunityPermissionPolicy):
    """Access control configuration for communities.
    """

    #
    # Communities
    #
    can_create = [
        SystemProcess(),
        GeoSecretariat()
    ]


#
# Introspecting to change permissions.
#
def update_overwritten_permissions(source_class, target_class, permission_prefix="can"):
    for propertie in list(
        filter(lambda x: permission_prefix in x, dir(source_class))
    ):
        setattr(
            source_class,
            propertie,
            getattr(target_class, propertie)
        )


# ToDo: When InvenioRDM modules allow modification of
#  the authentication base class, replace directly with "records" module classes
update_overwritten_permissions(
    RDMRecordPermissionPolicy, GeoRecordPermissionPolicy
)

update_overwritten_permissions(
    CommunityPermissionPolicy, GeoCommunityPermissionPolicy
)
