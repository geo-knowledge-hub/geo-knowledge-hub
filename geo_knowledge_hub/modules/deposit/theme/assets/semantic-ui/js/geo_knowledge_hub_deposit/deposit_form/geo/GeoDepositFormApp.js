import { GeoDepositApiClient } from "./GeoDepositApiClient";
import { DepositFormApp, DepositFileUploader } from "react-invenio-deposit";

export class GeoDepositFormApp extends DepositFormApp {
  constructor(props) {
    // defining API Client config
    const apiClientConfig = props.apiClientConfig || props.config;

    // preparing the new instance controller
    let controller = null;
    if (props.controller) {
      const apiClient = new GeoDepositApiClient(apiClientConfig.createUrl);
      const fileUploader = new DepositFileUploader(apiClient, props.config);

      controller = new props.controller(apiClient, fileUploader);
    }

    super({ ...props, controller: controller });
  }
}
