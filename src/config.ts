/** GLOBAL DATA */

const BASE_URL = new URL(import.meta.env.SITE);

export const SITE = {
  title: "Clayton's Blog",
  description: "An inquisitive software engineer jotting down his thoughts",
  name: "Clayton Herbst",
  url: BASE_URL.origin,
};
