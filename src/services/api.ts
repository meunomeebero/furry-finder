import axios from "axios";

export class AxiosAPI {
  static token?: string;

  private getClient() {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Authorization: 'Bearer ' + AxiosAPI.token,
      }
    });
  }

  public async getMe(token: string) {
    try {
      const { data } = await this.getClient().post('/users', {}, {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      });

      return data;
    } catch {
      return null;
    }
  }
  public async setMyAccountAsFF(token: string, gender: string) {
    try {
      const { data } = await axios.patch('/api/v1/users', {
        token,
        gender,
      });

      return data;
    } catch {
      return null;
    }
  }
}

export const api = new AxiosAPI();
