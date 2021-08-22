import { BooksTable } from "./modules/BooksTable.js";

fetch("data.json")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Problem with getting json file");
    }
  })
  .then((json) => new BooksTable(json))
  .catch((error) => console.error(error));
