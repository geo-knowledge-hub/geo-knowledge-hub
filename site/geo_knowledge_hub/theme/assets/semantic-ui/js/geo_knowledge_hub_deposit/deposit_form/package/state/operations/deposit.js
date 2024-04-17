/*
 * This file is part of GEO Knowledge Hub.
 * Copyright (C) 2021-2022 GEO Secretariat.
 *
 * GEO Knowledge Hub is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import _get from "lodash/get";
import _set from "lodash/set";
import _isNil from "lodash/isNil";
import _isEmpty from "lodash/isEmpty";

import {
  // Deposit operation: General
  DEPOSIT_RESOURCES_UNKNOWN_ERROR,
  // Deposit operation: Messages
  DEPOSIT_RESOURCES_CLEAN_MESSAGE,
  // Deposit operation: Attaching operation
  DEPOSIT_RESOURCES_ATTACHING_START,
  DEPOSIT_RESOURCES_ATTACHING_FINISH,
  DEPOSIT_RESOURCES_ATTACHING_ERROR,
  DEPOSIT_RESOURCES_ATTACHING_SUCCESS,
  // Deposit operation: Associating and Attaching operations.
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_START,
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_ERROR,
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_SUCCESS,
  DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_FINISH,
  // Deposit operation: Manipulating draft.
  DEPOSIT_RESOURCE_SAVING_DRAFT_START,
  DEPOSIT_RESOURCE_SAVING_DRAFT_ERROR,
  DEPOSIT_RESOURCE_SAVING_DRAFT_SUCCESS,
  DEPOSIT_RESOURCE_SAVING_DRAFT_FINISH,
  // Deposit operation: Importing resources from one version to another.
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_START,
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_ERROR,
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_SUCCESS,
  DEPOSIT_RESOURCE_IMPORTING_RESOURCES_FINISH,
  // Deposit operation: Editing a resource.
  DEPOSIT_RESOURCE_EDITING_RESOURCE_START,
  DEPOSIT_RESOURCE_EDITING_RESOURCE_ERROR,
  DEPOSIT_RESOURCE_EDITING_RESOURCE_FINISH,
  // Deposit operation: Detaching resource from the package.
  DEPOSIT_RESOURCES_DETACHING_START,
  DEPOSIT_RESOURCES_DETACHING_ERROR,
  DEPOSIT_RESOURCES_DETACHING_SUCCESS,
  DEPOSIT_RESOURCES_DETACHING_FINISH,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_START,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_ERROR,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_SUCCESS,
  DEPOSIT_RESOURCE_VERSION_RESOURCE_FINISH,
  DEPOSIT_RESOURCE_DELETE_RESOURCE_SUCCESS,
  DEPOSIT_RESOURCE_DELETE_RESOURCE_FINISH,
  DEPOSIT_RESOURCE_DELETE_RESOURCE_START,
  DEPOSIT_RESOURCE_DELETE_RESOURCE_ERROR,
} from "../actions";

import {
  layoutResourcesCloseModal,
  layoutResourcesCloseModalSearch,
  layoutResourcesOpenModal,
  layoutResourcesStartUpdateResourceList,
} from "./layout";

import { PackagesApiClient, RecordApiClient } from "../../../../resources";
import {
  storageCleanResourceTemporaryData,
  storageReloadPackageRecord,
} from "./storage";

import { i18next } from "@translations/geo_knowledge_hub/i18next";

/**
 * Dispatch operation to clean deposit messages (e.g., Error messages).
 */
export const depositCleanMessages = () => {
  return async (dispatch) => {
    // Dispatching! The cleaning operation is done by
    // the Deposit reducer.
    setTimeout(() => {
      dispatch({
        type: DEPOSIT_RESOURCES_CLEAN_MESSAGE,
      });
    }, 5000);
  };
};

/**
 * Dispatch operation to attach a resource to the package available
 * in the application context.
 */
export const depositResourcesAttach = (recordData, operationMetadata) => {
  return async (dispatch, getState) => {
    // Getting the package associates with the resource
    const currentState = getState();

    // Preparing the package object.
    const { packageObject } = currentState.storage;
    const { record: packageRecord } = packageObject;

    const operationTitleSuccess = i18next.t(
      "Attaching resource operation was succeeded"
    );
    const operationTitleError = i18next.t(
      "Attaching resource operation errors"
    );

    // Operating!
    dispatch({
      type: DEPOSIT_RESOURCES_ATTACHING_START,
      payload: operationMetadata,
    });

    try {
      const packagesApiClient = new PackagesApiClient();

      // 1. Add the resource to the current version of the package
      const response = await packagesApiClient.packageAddResources(
        packageRecord,
        [recordData]
      );

      // 2. Processing
      if (response.code === 200) {
        const responseData = response.data;

        // 2.1 Checking for errors
        if (responseData.errors.length > 0) {
          dispatch({
            type: DEPOSIT_RESOURCES_ATTACHING_ERROR,
            payload: {
              title: operationTitleError,
              errors: responseData.errors,
              componentId: operationMetadata.componentId,
            },
          });
        }

        // 2.2. Updating the interface
        else {
          // Updating package from store!
          await dispatch(storageReloadPackageRecord());
          await dispatch(layoutResourcesCloseModalSearch());
          await dispatch(layoutResourcesStartUpdateResourceList());

          // 2.3. Finishing the operation
          dispatch({
            type: DEPOSIT_RESOURCES_ATTACHING_SUCCESS,
            payload: {
              title: operationTitleSuccess,
              componentId: operationMetadata.componentId,
            },
          });
        }
      } else {
        dispatch({
          type: DEPOSIT_RESOURCES_ATTACHING_ERROR,
          payload: {
            title: operationTitleError,
            errors: [
              {
                message: i18next.t(
                  "Error in connecting with the GEO Knowledge Hub API"
                ),
              },
            ],
            componentId: operationMetadata.componentId,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: DEPOSIT_RESOURCES_ATTACHING_ERROR,
        payload: {
          title: operationTitleError,
          errors: [
            {
              message: i18next.t(
                "Error in connecting with the GEO Knowledge Hub API"
              ),
            },
          ],
          componentId: operationMetadata.componentId,
        },
      });
    }

    await dispatch({
      type: DEPOSIT_RESOURCES_ATTACHING_FINISH,
    });

    dispatch(depositCleanMessages());
  };
};

/**
 * Dispatch operation to discard from GEO Knowledge Hub the
 * temporary resource created by the user thought the resource
 * interface.
 */
export const depositDiscardTemporaryResource = () => {
  return async (dispatch, getState) => {
    // Base definitions
    const recordApiClient = new RecordApiClient();
    const depositGeneralError = i18next.t("Error to remove the draft");

    // 1. Getting the current state.
    const currentState = getState();

    // 2. Extracting from storage context the temporary resource
    // generated by the user.
    const stateResourceTemporaryObject =
      currentState.storage.resourceTemporaryObject;

    if (
      stateResourceTemporaryObject.id &&
      !_isEmpty(stateResourceTemporaryObject)
    ) {
      // Checking if the draft should be deleted.
      const shouldBeDeleted =
        stateResourceTemporaryObject?.relationship === undefined;

      if (shouldBeDeleted) {
        try {
          // 3. Deleting draft.
          const response = await recordApiClient.deleteDraft(
            stateResourceTemporaryObject
          );

          if (response.code !== 204) {
            // 3.1. Showing error when needed.
            dispatch({
              type: DEPOSIT_RESOURCES_UNKNOWN_ERROR,
              payload: {
                title: depositGeneralError,
                errors: [
                  {
                    message: i18next.t(
                      "Error in connecting with the GEO Knowledge Hub API"
                    ),
                  },
                ],
              },
            });
          }
        } catch (error) {
          dispatch({
            type: DEPOSIT_RESOURCES_UNKNOWN_ERROR,
            payload: {
              title: depositGeneralError,
              errors: [
                {
                  message: i18next.t(
                    "Error in connecting with the GEO Knowledge Hub API"
                  ),
                },
              ],
            },
          });
        }
      }

      // We always need to remove the temporary data from the store
      // to avoid data leak.
      await dispatch(storageCleanResourceTemporaryData());

      dispatch(depositCleanMessages());
    }
  };
};

/**
 * Deposit operation to associate and attach a package in a package.
 */
export const depositResourceAssociateAndAttachDraft = (
  recordData,
  operationMetadata,
  updateInterface = true
) => {
  return async (dispatch, getState) => {
    let status = true;

    // Getting the package associates with the resource
    const currentState = getState();

    // Preparing the package object.
    const { packageObject } = currentState.storage;
    const { record: packageRecord } = packageObject;

    const operationTitleSuccess = i18next.t(
      "Attaching resource operation was succeeded"
    );
    const operationTitleError = i18next.t(
      "Attaching resource operation errors"
    );

    // Operating
    dispatch({
      type: DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_START,
      payload: operationMetadata,
    });

    try {
      const packagesApiClient = new PackagesApiClient();

      // 1. Associating the draft with the package.
      const associateResponse = await packagesApiClient.contextAssociateDrafts(
        packageRecord,
        [recordData]
      );

      if (associateResponse.code !== 204) {
        status = false;

        dispatch({
          type: DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_ERROR,
          payload: {
            title: operationTitleError,
            errors: associateResponse.errors,
            componentId: operationMetadata.componentId,
          },
        });
      }

      // 2. Attaching the resource to the package
      else {
        const attachResponse = await packagesApiClient.packageAddResources(
          packageRecord,
          [recordData]
        );

        if (attachResponse.code !== 200) {
          status = false;

          dispatch({
            type: DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_ERROR,
            payload: {
              title: operationTitleError,
              errors: associateResponse.errors,
              componentId: operationMetadata.componentId,
            },
          });
        }

        // 3. Updating the operation
        else {
          // Updating package from store!
          await dispatch(storageReloadPackageRecord());
          await dispatch(layoutResourcesStartUpdateResourceList());

          if (updateInterface) {
            await dispatch(layoutResourcesCloseModal());
          }

          // 3.1. Finishing the operation
          dispatch({
            type: DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_SUCCESS,
            payload: {
              title: operationTitleSuccess,
              componentId: operationMetadata.componentId,
            },
          });
        }
      }
    } catch (error) {
      status = false;

      dispatch({
        type: DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_ERROR,
        payload: {
          title: operationTitleError,
          errors: [
            {
              message: i18next.t(
                "Error in connecting with the GEO Knowledge Hub API"
              ),
            },
          ],
          componentId: operationMetadata.componentId,
        },
      });
    }

    await dispatch({
      type: DEPOSIT_RESOURCES_ASSOCIATING_AND_ATTACHING_FINISH,
      payload: operationMetadata,
    });

    dispatch(depositCleanMessages());

    return status;
  };
};

/**
 * Dispatch operation to save a draft.
 */
export const depositResourceSaveDraft = (recordData, operationMetadata) => {
  return async (dispatch) => {
    // Base definitions
    const recordApiClient = new RecordApiClient();

    const operationTitleSuccess = i18next.t("Modification saved");
    const operationTitleError = i18next.t("Error in saving the modification");

    // Operating
    dispatch({
      type: DEPOSIT_RESOURCE_SAVING_DRAFT_START,
      payload: operationMetadata,
    });

    try {
      // 1. Checking if is a draft
      let recordDraft = recordData;
      const isDraft = ["draft", "new_version_draft"].includes(recordData.status);

      if (!isDraft) {
        // We need to create a draft to edit it
        const newDraftResponse = await recordApiClient.edit(recordData);

        if (newDraftResponse.code !== 201) {
          dispatch({
            type: DEPOSIT_RESOURCE_SAVING_DRAFT_ERROR,
            payload: {
              title: operationTitleError,
              errors: newDraftResponse.errors,
              componentId: operationMetadata.componentId,
            },
          });
        }

        // 2. Preparing the draft data to be saved
        recordDraft = newDraftResponse.data;

        _set(recordData, "links", recordDraft.links);
      } else {
        if (_isNil(_get(recordData, "links.self"))) {
          _set(recordData, "links.self", _get(recordData, "links.draft"));
        }
      }

      // 3. Saving the draft
      const savingDraftResponse = await recordApiClient.saveDraft(recordData);

      if (savingDraftResponse.code !== 200) {
        dispatch({
          type: DEPOSIT_RESOURCE_SAVING_DRAFT_ERROR,
          payload: {
            title: operationTitleError,
            errors: savingDraftResponse.errors,
            componentId: operationMetadata.componentId,
          },
        });
      }

      // 4. Checking if we need to publish the draft
      if (!isDraft) {
        const publishResponse = recordApiClient.publishDraft(recordData);

        if (publishResponse.code !== 202) {
          dispatch({
            type: DEPOSIT_RESOURCE_SAVING_DRAFT_ERROR,
            payload: {
              title: operationTitleError,
              errors: publishResponse.errors,
              componentId: operationMetadata.componentId,
            },
          });
        }
      }

      // Finishing the operation!
      dispatch({
        type: DEPOSIT_RESOURCE_SAVING_DRAFT_SUCCESS,
        payload: {
          title: operationTitleSuccess,
          componentId: operationMetadata.componentId,
        },
      });
    } catch (error) {
      dispatch({
        type: DEPOSIT_RESOURCE_SAVING_DRAFT_ERROR,
        payload: {
          title: operationTitleError,
          errors: [
            {
              message: i18next.t(
                "Error in connecting with the GEO Knowledge Hub API"
              ),
            },
          ],
          componentId: operationMetadata.componentId,
        },
      });
    }

    dispatch({
      type: DEPOSIT_RESOURCE_SAVING_DRAFT_FINISH,
      payload: operationMetadata,
    });

    dispatch(depositCleanMessages());
  };
};

/**
 * Dispatch operation to import resources from a package version to another.
 */
export const depositImportResources = (recordData, operationMetadata) => {
  return async (dispatch) => {
    // Base definitions
    const packagesApiClient = new PackagesApiClient();

    const operationTitleSuccess = i18next.t("Resources imported successfully");
    const operationTitleError = i18next.t(
      "Error in importing resources from the previous version"
    );

    // Operating
    dispatch({
      type: DEPOSIT_RESOURCE_IMPORTING_RESOURCES_START,
      payload: {
        operation: operationMetadata,
      },
    });

    try {
      // 1. Importing resources from the previous version.
      const importResourcesResponse =
        await packagesApiClient.packageImportResources(recordData);

      // 1.1. Checking for errors
      if (importResourcesResponse.code !== 204) {
        dispatch({
          type: DEPOSIT_RESOURCE_IMPORTING_RESOURCES_ERROR,
          payload: {
            title: operationTitleError,
            errors: importResourcesResponse.errors,
            componentId: operationMetadata.componentId,
          },
        });
      } else {
        // 2. Finishing the operation.
        dispatch({
          type: DEPOSIT_RESOURCE_IMPORTING_RESOURCES_SUCCESS,
          payload: {
            title: operationTitleSuccess,
            componentId: operationMetadata.componentId,
          },
        });

        // 3. Updating the interface
        await dispatch(storageReloadPackageRecord());
        await dispatch(layoutResourcesStartUpdateResourceList());
      }
    } catch (err) {
      dispatch({
        type: DEPOSIT_RESOURCE_IMPORTING_RESOURCES_ERROR,
        payload: {
          title: operationTitleError,
          errors: [
            {
              message: i18next.t(
                "Error in connecting with the GEO Knowledge Hub API"
              ),
            },
          ],
          componentId: operationMetadata.componentId,
        },
      });
    }

    dispatch({
      type: DEPOSIT_RESOURCE_IMPORTING_RESOURCES_FINISH,
      payload: operationMetadata,
    });

    dispatch(depositCleanMessages());
  };
};

/**
 * Dispatch operation to prepare a resource to be edited.
 */
export const depositResourcesEdit = (recordData, operationMetadata) => {
  return async (dispatch, getState) => {
    // Base definitions
    const recordApiClient = new RecordApiClient();

    const currentState = getState();

    // Preparing the package object.
    const { packageObject } = currentState.storage;
    const { record: packageRecord } = packageObject;

    const operationTitleSuccess = i18next.t("Draft saved successfully!");
    const operationTitleError = i18next.t("Error in editing the draft");

    // Operating
    dispatch({
      type: DEPOSIT_RESOURCE_EDITING_RESOURCE_START,
      payload: operationMetadata,
    });

    // 1. Checking if the selected record can be edited
    //    from the current package.
    const { record: resourceData, config: resourceConfig } = recordData;

    const packageParent = packageRecord.parent.id;
    const resourceManager = resourceData.parent?.relationship?.managed_by?.id;

    const resourceCanBeEdited = resourceManager === packageParent;

    if (resourceCanBeEdited) {
      try {
        // 2. Checking if is a draft
        let recordDraft = resourceData;
        const isDraft = ["draft", "new_version_draft"].includes(resourceData.status);

        if (!isDraft) {
          // 2.1. We need to create a draft to edit it
          const newDraftResponse = await recordApiClient.edit(resourceData);

          if (newDraftResponse.code !== 201) {
            dispatch({
              type: DEPOSIT_RESOURCE_EDITING_RESOURCE_ERROR,
              payload: {
                title: operationTitleError,
                errors: newDraftResponse.errors,
                componentId: operationMetadata.componentId,
              },
            });
          }

          // 3. Preparing the draft data to be saved
          recordDraft = newDraftResponse.data;

          _set(resourceData, "links", recordDraft.links);
        } else {
          const draftLink = _get(recordDraft, "links.draft");

          if (draftLink) {
            _set(resourceData, "links.self", _get(recordDraft, "links.draft"));
          }
        }

        // 4. Getting record files
        const isFileEnabled = _get(recordDraft, "files.enabled");

        if (isFileEnabled) {
          const recordFilesResponse = await recordApiClient.listFiles(
            resourceData
          );

          if (recordFilesResponse.code !== 200) {
            dispatch({
              type: DEPOSIT_RESOURCE_EDITING_RESOURCE_ERROR,
              payload: {
                title: operationTitleError,
                errors: recordFilesResponse.errors,
                componentId: operationMetadata.componentId,
              },
            });
          } else {
            _set(resourceData, "files", _get(recordFilesResponse, "data"));
          }
        }

        await dispatch({
          type: DEPOSIT_RESOURCE_EDITING_RESOURCE_FINISH,
          payload: operationMetadata,
        });

        // 4. Starting the new operation.
        dispatch(
          layoutResourcesOpenModal({
            record: resourceData,
            config: resourceConfig,
            files: resourceData.files,
          })
        );
      } catch (error) {
        dispatch({
          type: DEPOSIT_RESOURCE_EDITING_RESOURCE_ERROR,
          payload: {
            title: operationTitleError,
            errors: [
              {
                message: i18next.t(
                  "Error in connecting with the GEO Knowledge Hub API"
                ),
              },
            ],
            componentId: operationMetadata.componentId,
          },
        });
      }
    } else {
      dispatch({
        type: DEPOSIT_RESOURCE_EDITING_RESOURCE_ERROR,
        payload: {
          title: operationTitleError,
          errors: [
            {
              message: i18next.t(
                "You can't edit a resource not managed by the current package."
              ),
            },
          ],
          componentId: operationMetadata.componentId,
        },
      });
    }
  };
};

/**
 * Dispatch operation to remove a resource from a package.
 */
export const depositResourcesDetach = (recordData, operationMetadata) => {
  return async (dispatch, getState) => {
    // Getting the package associates with the resource
    const currentState = getState();

    // Preparing the package object.
    const { packageObject } = currentState.storage;
    const { record: packageRecord } = packageObject;

    // Base definitions
    const packagesApiClient = new PackagesApiClient();

    // Extracting operation properties
    const { record: resourceRecord } = recordData;

    const operationTitleSuccess = i18next.t("Resource Detached successfully");
    const operationTitleError = i18next.t(
      "Error in detaching the selected resource"
    );

    // Operating!
    dispatch({
      type: DEPOSIT_RESOURCES_DETACHING_START,
      payload: operationMetadata,
    });

    try {
      // 1. Detaching resource from the current version of the package.
      const detachingResponse = await packagesApiClient.packageRemoveResources(
        packageRecord,
        [resourceRecord]
      );

      if (detachingResponse.code !== 200) {
        dispatch({
          type: DEPOSIT_RESOURCES_DETACHING_ERROR,
          payload: {
            title: operationTitleError,
            errors: detachingResponse.errors,
            componentId: operationMetadata.componentId,
          },
        });
      }

      // 2. Updating the interface
      else {
        // 2.1. Updating package from store!
        await dispatch(storageReloadPackageRecord());
        await dispatch(layoutResourcesStartUpdateResourceList());

        // 2.2. Finishing the operation!
        dispatch({
          type: DEPOSIT_RESOURCES_DETACHING_SUCCESS,
          payload: {
            title: operationTitleSuccess,
            componentId: operationMetadata.componentId,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: DEPOSIT_RESOURCES_DETACHING_ERROR,
        payload: {
          title: operationTitleError,
          errors: [
            {
              message: i18next.t(
                "Error in connecting with the GEO Knowledge Hub API"
              ),
            },
          ],
          componentId: operationMetadata.componentId,
        },
      });
    }

    await dispatch({
      type: DEPOSIT_RESOURCES_DETACHING_FINISH,
    });

    dispatch(depositCleanMessages());
  };
};

/**
 * Dispatch operation to create a new version of a resource and associate it
 * with the current package.
 */
export const depositResourcesNewVersion = (recordData, operationMetadata) => {
  return async (dispatch, getState) => {
    // Getting the package associates with the resource
    const currentState = getState();

    // Preparing the package object.
    const { packageObject } = currentState.storage;
    const { record: packageRecord } = packageObject;

    // Base definitions
    const recordApiClient = new RecordApiClient();
    const packagesApiClient = new PackagesApiClient();

    const operationTitleSuccess = i18next.t(
      "The new resource version was created successfully"
    );
    const operationTitleError = i18next.t(
      "Error to create a new version of the resource"
    );

    // Operating
    dispatch({
      type: DEPOSIT_RESOURCE_VERSION_RESOURCE_START,
      payload: operationMetadata,
    });

    // 1. Checking if the selected record can be handled
    //    from the current package.
    const { record: resourceData, config: resourceConfig } = recordData;

    const packageParent = packageRecord.parent.id;
    const resourceManager = resourceData.parent?.relationship?.managed_by?.id;

    const resourceCanBeEdited = resourceManager === packageParent;

    if (resourceCanBeEdited) {
      try {
        // 2. Checking if is a published resource
        let recordDraft = resourceData;
        const isPublished = resourceData.status === "published";

        if (!isPublished) {
          dispatch({
            type: DEPOSIT_RESOURCE_VERSION_RESOURCE_ERROR,
            payload: {
              title: operationTitleError,
              errors: [
                {
                  message: i18next.t(
                    "You need to use a published resource to create a new version"
                  ),
                },
              ],
              componentId: operationMetadata.componentId,
            },
          });
        }

        // 3. Creating the new version
        else {
          const newVersionResponse = await recordApiClient.newVersion(
            resourceData
          );

          if (newVersionResponse.code !== 201) {
            dispatch({
              type: DEPOSIT_RESOURCE_VERSION_RESOURCE_ERROR,
              payload: {
                title: operationTitleError,
                errors: newVersionResponse.errors,
                componentId: operationMetadata.componentId,
              },
            });
          }

          // 3.1. Now, we need to remove the previous version
          //      and attach the new one
          else {
            // ToDo: This can be a different dispatch operation! this makes it more reusable
            const detachingResponse =
              await packagesApiClient.packageRemoveResources(packageRecord, [
                resourceData,
              ]);

            if (detachingResponse.code !== 200) {
              dispatch({
                type: DEPOSIT_RESOURCE_VERSION_RESOURCE_ERROR,
                payload: {
                  title: operationTitleError,
                  errors: detachingResponse.errors,
                  componentId: operationMetadata.componentId,
                },
              });
            }

            // 3.2. Now, we are able to attach the new version.
            else {
              const associationResult = await dispatch(
                depositResourceAssociateAndAttachDraft(
                  newVersionResponse.data,
                  operationMetadata,
                  false
                )
              );

              // Finishing
              if (associationResult) {
                dispatch({
                  type: DEPOSIT_RESOURCE_VERSION_RESOURCE_SUCCESS,
                  payload: {
                    title: operationTitleSuccess,
                    componentId: operationMetadata.componentId,
                  },
                });

                // Opening the edition window
                const newVersion = newVersionResponse.data;

                _set(resourceConfig, "apiUrl", newVersion.links.self);

                dispatch(
                  layoutResourcesOpenModal({
                    record: newVersion,
                    config: resourceConfig,
                    files: newVersion.files,
                  })
                );
              }
            }
          }
        }
      } catch (error) {
        dispatch({
          type: DEPOSIT_RESOURCE_VERSION_RESOURCE_ERROR,
          payload: {
            title: operationTitleError,
            errors: [
              {
                message: i18next.t(
                  "Error in connecting with the GEO Knowledge Hub API"
                ),
              },
            ],
            componentId: operationMetadata.componentId,
          },
        });
      }
    }

    dispatch({
      type: DEPOSIT_RESOURCE_VERSION_RESOURCE_FINISH,
      payload: operationMetadata,
    });

    dispatch(depositCleanMessages());
  };
};

/**
 * Dispatch operation to delete a draft record from the current package.
 */
export const depositResourcesDelete = (recordData, operationMetadata) => {
  return async (dispatch, getState) => {
    // Getting the package associates with the resource
    const currentState = getState();

    // Preparing the package object.
    const { packageObject } = currentState.storage;
    const { record: packageRecord } = packageObject;

    // Base definitions
    const recordApiClient = new RecordApiClient();

    const operationTitleSuccess = i18next.t("Resource successfully deleted");
    const operationTitleError = i18next.t(
      "Error to delete the selected resource"
    );

    dispatch({
      type: DEPOSIT_RESOURCE_DELETE_RESOURCE_START,
      payload: operationMetadata,
    });

    // 1. Checking if the selected record can be handled
    //    from the current package.
    const { record: resourceData, config: resourceConfig } = recordData;

    const packageParent = packageRecord.parent.id;
    const resourceManager = resourceData.parent?.relationship?.managed_by?.id;

    const resourceCanBeDeleted = resourceManager === packageParent;

    if (resourceCanBeDeleted) {
      try {
        // 2. Checking if is a published resource
        let recordDraft = resourceData;
        const isPublished = resourceData.status === "published";

        if (isPublished) {
          dispatch({
            type: DEPOSIT_RESOURCE_DELETE_RESOURCE_ERROR,
            payload: {
              title: operationTitleError,
              errors: [
                {
                  message: i18next.t("You can't delete a published resource"),
                },
              ],
              componentId: operationMetadata.componentId,
            },
          });
        }

        // 3. Deleting the draft record
        else {
          // The backup will remove the reference to the record from the package.
          const deleteResponse = await recordApiClient.deleteDraft(
            resourceData
          );

          if (deleteResponse.code !== 204) {
            dispatch({
              type: DEPOSIT_RESOURCE_DELETE_RESOURCE_ERROR,
              payload: {
                title: operationTitleError,
                errors: deleteResponse.errors,
                componentId: operationMetadata.componentId,
              },
            });
          }
          // 4. Updating the interface
          else {
            await dispatch(storageReloadPackageRecord());
            await dispatch(layoutResourcesStartUpdateResourceList());

            // 4.1. Finishing the operation
            dispatch({
              type: DEPOSIT_RESOURCE_DELETE_RESOURCE_SUCCESS,
              payload: {
                title: operationTitleSuccess,
                componentId: operationMetadata.componentId,
              },
            });
          }
        }
      } catch (error) {
        dispatch({
          type: DEPOSIT_RESOURCE_DELETE_RESOURCE_ERROR,
          payload: {
            title: operationTitleError,
            errors: [
              {
                message: i18next.t(
                  "Error in connecting with the GEO Knowledge Hub API"
                ),
              },
            ],
            componentId: operationMetadata.componentId,
          },
        });
      }
    }

    await dispatch({
      type: DEPOSIT_RESOURCE_DELETE_RESOURCE_FINISH,
      payload: operationMetadata,
    });

    dispatch(depositCleanMessages());
  };
};
