/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect } from "react";

import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import { Button, Grid, Modal, Header, Message } from "semantic-ui-react";

import { http } from "react-invenio-forms";
import { i18next } from "@translations/geo_knowledge_hub/i18next";

import { PackageSearchContext } from "./context";
import { ConfirmationModal } from "../../../base";
import { PackageSelectorSearch } from "./PackageSelectorSearch";

/**
 * Modal to select and associate a resource
 * with a package.
 */
export const PackageSelectorModal = ({
  modalRecord,
  modalTrigger,
  modalOnClose,
}) => {
  // States
  const [inOperation, setInOperation] = useState(false);
  const [errors, setErrors] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationMetadata, setConfirmationMetadata] = useState({});

  useEffect(() => {
    if (!_isEmpty(errors)) {
      setTimeout(() => {
        setErrors([]);
        setInOperation(false);
      }, 6000);
    }
  }, [errors, inOperation]);

  // Context configuration
  const context = {
    selectedPackage,
    setSelectedPackage,
  };

  return (
    <PackageSearchContext.Provider value={context}>
      <Modal
        role="dialog"
        aria-labelledby="community-modal-header"
        id="community-selection-modal"
        className="m-0"
        closeIcon
        closeOnDimmerClick={false}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);

          if (modalOnClose) {
            modalOnClose();
          }
        }}
        onOpen={() => {
          setModalOpen(true);
        }}
        trigger={React.cloneElement(modalTrigger, {
          "aria-haspopup": "dialog",
          "aria-expanded": modalOpen,
        })}
      >
        <Modal.Header>
          <Header as="h2" id="community-modal-header">
            {i18next.t("Select a package")}
          </Header>
        </Modal.Header>
        <Modal.Content>
          {!_isEmpty(errors) && (
            <Grid>
              <Grid.Row fluid>
                <Grid.Column width={16}>
                  <Message
                    error
                    header={i18next.t(
                      "Error to associate the resource with the package."
                    )}
                    list={errors}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
          <PackageSelectorSearch />
        </Modal.Content>

        <Modal.Actions>
          <Button
            positive
            icon="checkmark"
            content="Add"
            labelPosition="right"
            loading={inOperation}
            disabled={_isEmpty(selectedPackage)}
            onClick={() => {
              if (!_isEmpty(selectedPackage)) {
                setConfirmationMetadata({
                  open: true,
                  title: i18next.t("Package association"),
                  content: i18next.t(
                    "Are you sure you want to add " +
                      "your resource to the selected package ?"
                  ),
                  onAccept: async (e) => {
                    setInOperation(true);
                    setConfirmationMetadata({ open: false });

                    // Checking if resource can be linked with the package
                    const associationErrors = [];

                    const isAlreadyPublished =
                      modalRecord?.id !== undefined &&
                      ["new_version_draft", "draft"].includes(
                        modalRecord?.status
                      );

                    const isAssociatedWithCommunities = !_isEmpty(
                      modalRecord?.parent?.communities
                    );

                    const isAssociatedWithAPackage = !_isEmpty(
                      modalRecord?.parent?.relationship?.managed_by
                    );

                    if (isAlreadyPublished) {
                      associationErrors.push(
                        i18next.t("Only drafts can be added to a package")
                      );
                    }

                    if (isAssociatedWithAPackage) {
                      associationErrors.push(
                        i18next.t(
                          "Resource is already associated with a package"
                        )
                      );
                    }

                    if (isAssociatedWithCommunities) {
                      associationErrors.push(
                        i18next.t(
                          "Resource can't be associated with a community"
                        )
                      );
                    }

                    if (!_isEmpty(associationErrors)) {
                      setErrors(associationErrors);
                      setConfirmationMetadata({ open: false });
                    }

                    // Is the resource is valid, the operation can be executed
                    else {
                      try {
                        // 1. Check if is the resource is a valid draft.
                        let draftData = {};

                        if (_isNil(modalRecord?.id)) {
                          const draftResponse = await http.post(
                            "/api/records",
                            modalRecord
                          );

                          if (draftResponse.status !== 201) {
                            return setErrors([
                              i18next.t("Error to create a new draft"),
                            ]);
                          } else {
                            draftData = draftResponse.data;
                          }
                        } else {
                          draftData = modalRecord;
                        }

                        // 2. Adding the draft as a resource of the package
                        const associateResponse = await http.post(
                          selectedPackage.links.context_associate,
                          {
                            records: [{ id: draftData.id }],
                          }
                        );

                        if (associateResponse.status !== 204) {
                          return setErrors([
                            i18next.t(
                              "Error to associate the draft with the package"
                            ),
                          ]);
                        }

                        // 3. Adding the resource into the selected package
                        else {
                          const attachUrl = `/api/packages/${selectedPackage.id}/draft/resources`;

                          const attachResponse = await http.post(
                            attachUrl,
                            {
                              resources: [{ id: draftData.id }],
                            }
                          );

                          if (attachResponse.status !== 200) {
                            return setErrors([
                              i18next.t(
                                "Error to attach the draft in the selected package"
                              ),
                            ]);
                          } else {
                            window.location = draftData.links.self_html;
                          }
                        }
                      } catch (error) {
                        return setErrors([
                          i18next.t(
                            "Error to connect with the GEO Knowledge Hub API"
                          ),
                        ]);
                      }
                    }
                  },
                  onRefuse: (e) => {
                    setConfirmationMetadata({ open: false });
                  },
                  onClose: (e) => {
                    setConfirmationMetadata({ open: false });
                  },
                });
              }
            }}
          />
        </Modal.Actions>
      </Modal>
      <ConfirmationModal {...confirmationMetadata} />
    </PackageSearchContext.Provider>
  );
};
