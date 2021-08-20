const list = [
  {
    id: 1,
    polishTitle: "tytuł",
    numberOfPages: 175,
    releaseDate: "2019-05-28",
  },
  {
    id: 2,
    polishTitle: "tytuł jeszcze jakiś",
    numberOfPages: 283,
    releaseDate: "2021-03-17",
  },
  {
    id: 3,
    polishTitle: "kolejny tytuł",
    numberOfPages: 93,
    releaseDate: "2015-10-03",
  },
  {
    id: 4,
    polishTitle: "coś jeszcze napisali",
    numberOfPages: 127,
    releaseDate: "2018-02-26",
  },
  {
    id: 5,
    polishTitle: "i jeszcze",
    numberOfPages: 227,
    releaseDate: "2016-02-26",
  },
  {
    id: 6,
    polishTitle: "napisali",
    numberOfPages: 284,
    releaseDate: "2018-07-11",
  },
  {
    id: 7,
    polishTitle: "jeszcze",
    numberOfPages: 63,
    releaseDate: "2018-02-19",
  },
];

const list2 = [];

class BooksTable {
  constructor(data) {
    this.data = this.getData(data);
    this.tableBody = document.querySelector(".table__body--js");
    this.template = document.querySelector(".template--js");
  }

  checkData(data) {
    if (!Array.isArray(data)) {
      throw new Error("Data is not in an array");
    } else if (data.length === 0) {
      throw new Error("Data array is empty");
    } else if (
      data.some((book) => {
        return typeof book !== "object" || book === null || Array.isArray(book);
      })
    ) {
      throw new Error("There are non object values in data array");
    } else {
      return data;
    }
  }

  getData(data) {
    try {
      return this.checkData(data);
    } catch (error) {
      console.error(error);
    }
  }

  checkBookKeys(book) {
    // checks if book passed into function has proper keys, returns true if ok
    const properKeys = ["id", "polishTitle", "numberOfPages", "releaseDate"];
    const bookKeys = Object.keys(book);
    return (
      Array.isArray(bookKeys) &&
      bookKeys.length === properKeys.length &&
      bookKeys.every((key, index) => key === properKeys[index])
    );
  }

  checkBookValues(book) {
    // checks if types of book's values and date format are ok, returns true if ok
    const dateRegex = new RegExp("^\\d{4}-\\d{2}-\\d{2}$");
    return (
      typeof book.id === "number" &&
      typeof book.polishTitle === "string" &&
      typeof book.numberOfPages === "number" &&
      typeof book.releaseDate === "string" &&
      dateRegex.test(book.releaseDate)
    );
  }

  fillTemplate(book, index) {
    // pass index to catch where eventual errors are
    if (!this.checkBookKeys(book)) {
      throw new Error(`Incorrect data keys on index ${index} in data array`);
    } else if (!this.checkBookValues(book)) {
      throw new Error(`Incorrect data values on index ${index} in data array`);
    } else {
      this.template.content.querySelector(".row__id--js").innerHTML = book.id;
      this.template.content.querySelector(".row__title--js").innerHTML =
        book.polishTitle;
      this.template.content.querySelector(".row__pages--js").innerHTML =
        book.numberOfPages;
      this.template.content.querySelector(".row__date--js").innerHTML =
        book.releaseDate;
      return this.template.content;
    }
  }

  createRows() {
    try {
      this.data.forEach((book, index) => {
        const row = document.importNode(this.fillTemplate(book, index), true);
        this.tableBody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const table = new BooksTable(list);
console.log(table);

table.createRows();
