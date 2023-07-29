export const ROLE = {
  ADMIN: 1,
  USER: 2,
};

const SIGNED_URL_EXPIRY = 60 * 60; // in seconds
const DEFAULT_LIMIT_PER_PAGE = 50;
export { SIGNED_URL_EXPIRY, DEFAULT_LIMIT_PER_PAGE };

export const ENDPOINT_BY_PASS = [
  "/api/v1/auth/login",
  "/api/v1/auth/token",
  "/api/v1/auth/logout"
];
