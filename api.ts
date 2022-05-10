const BASE_URL = "http://52.78.5.27:8080/api";

const getCategories = () =>
  fetch(`${BASE_URL}/categories`).then((res) => res.json());

const getClubs = () => fetch(`${BASE_URL}/clubs`).then((res) => res.json());

export const clubApi = { getCategories, getClubs };
