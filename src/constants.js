export const baseURL = process.env.API;
export const apiURL = `${baseURL}/api/`;
export const contentURL = process.env.API;

export const permissions = {
  admin: {
    users: true,
    people: true,
  },
};
