const list = [
  {
    id: "ABCD",
    title: "tytuł",
    pages: 175,
    date: "2019-05-28",
  },
  {
    id: "YRCD",
    title: "tytuł jeszcze jakiś",
    pages: 283,
    date: "2021-03-17",
  },
  {
    id: "SBJD",
    title: "kolejny tytuł",
    pages: 93,
    date: "2015-10-03",
  },
  {
    id: "CKWD",
    title: "coś jeszcze napisali",
    pages: 127,
    date: "2018-02-26",
  },
  {
    id: "PWFB",
    title: "i jeszcze",
    pages: 227,
    date: "2016-02-26",
  },
  {
    id: "SFBA",
    title: "napisali",
    pages: 284,
    date: "2018-07-11",
  },
  {
    id: "WGBI",
    title: "jeszcze",
    pages: 63,
    date: "2018-02-19",
  },
];

const list2 = [];

class BooksTable {
  constructor(data) {
    this.data = this.getData(data); // pure (but formated) data from json
    this.dataToPresent = this.data; // data used to render rows to table - initially the same as data, but can be filtered
    this.tableBody = document.querySelector(".table__body--js");
    this.template = document.querySelector(".template--js");

    this.init(); // adds event listeners to inputs, renders initial data
  }

  init() {
    // adds event listeners to filter inputs
    const inputs = document.querySelectorAll(".filter__input--js");
    const filterRows = this.filterRows.bind(this); // creates local function that binds this (booksTable object) to its filterRows method
    inputs.forEach((input) => {
      input.addEventListener("focusin", () => {
        // when input is focused adds event listener for keyup (--- TODO ---: check change)
        input.addEventListener("keyup", filterRows);
      });
      input.addEventListener("focusout", () => {
        // removes keyup listener when input is not focused
        input.removeEventListener("keyup", filterRows);
      });
    });
    this.renderRows();
  }

  checkData(data) {
    if (!Array.isArray(data)) {
      // check if data is array
      throw new Error("Data is not in an array");
    } else if (data.length === 0) {
      // check if data is not empty
      throw new Error("Data array is empty");
    } else if (
      // check if all array items are real object (not null or array)
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
    const properKeys = ["id", "title", "pages", "date"];
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
      typeof book.id === "string" &&
      typeof book.title === "string" &&
      typeof book.pages === "number" &&
      typeof book.date === "string" &&
      dateRegex.test(book.date)
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
        book.title;
      this.template.content.querySelector(".row__pages--js").innerHTML =
        book.pages;
      this.template.content.querySelector(".row__date--js").innerHTML =
        book.date;
      return this.template.content;
    }
  }

  renderRows() {
    this.tableBody.innerHTML = ""; // clears table body
    try {
      this.dataToPresent.forEach((book, index) => {
        // pass index to catch where eventual errors are
        const row = document.importNode(this.fillTemplate(book, index), true);
        this.tableBody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
    }
  }

  filterRows(event) {
    const key = event.target.dataset.column; // data-column attributes of inputs: id, title, pages, date
    const value = event.target.value; // input value when event is fired

    this.dataToPresent = this.data.filter((book) => {
      // sets the content of dataToPresent based on filter
      let bookKey =
        typeof book[`${key}`] === "number"
          ? book[`${key}`].toString()
          : book[`${key}`]; // makes all book values strings to make it easier to compare to values
      return bookKey.toLowerCase().includes(value.toLowerCase());
    });
    this.renderRows(); // renders updated dataToPresent
  }
}

const booksTable = new BooksTable(list);
console.log(booksTable);
