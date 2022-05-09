
import axios from 'axios';
import {DepositApiClient} from "@geo-knowledge-hub/react-invenio-deposit";

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
    const recordIdUrl = `/api/records/${recordId}/draft`;
    return this.createResponse(() => axiosWithconfig.post(recordIdUrl));
  }

  async getLatestRecordVersion(recordId) {
    const recordIdUrl = `/api/records/${recordId}/versions/latest`;
    return this.createResponse(() => axiosWithconfig.get(recordIdUrl));
  }

  async saveAndPublish(draft) {
    await this.save(draft);
    await this.publish(draft);
  }

}
