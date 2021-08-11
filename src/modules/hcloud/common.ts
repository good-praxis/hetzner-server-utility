import axios from 'axios';

export const instance = () => {
  return axios.create({
    baseURL: 'https://api.hetzner.cloud/v1',
    headers: {
      Authorization: `Bearer ${process.env.HCLOUD_SECRET}`
    },
    data: {
      meta: {
        pagination: {
          per_page: 50
        }
      }
    }
  });
};
