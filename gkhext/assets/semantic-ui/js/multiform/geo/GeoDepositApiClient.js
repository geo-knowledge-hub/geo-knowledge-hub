
import axios from 'axios';
import {DepositApiClient} from "react-invenio-deposit";

const CancelToken = axios.CancelToken;
const apiConfig = {
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
  };
const axiosWithconfig = axios.create(apiConfig);

export class GeoDepositApiClient extends DepositApiClient {
  constructor(createUrl) {
    super(createUrl);
  }

  async createDraftFromApi(recordId) {
    const recordIdUrl = `/api/records/${recordId}/draft`
    return this.createResponse(() => axiosWithconfig.post(recordIdUrl));
  }
}
