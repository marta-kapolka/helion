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
    this.inputValues = {
      id: this.getInputValue("id"),
      title: this.getInputValue("title"),
      pages: this.getInputValue("pages"),
      date: this.getInputValue("date"),
    };

    this.init(); // adds event listeners to inputs, renders initial data
  }

  init() {
    // adds event listeners to filter inputs
    const inputs = document.querySelectorAll(".filter__input--js");
    const filter = this.filterRows.bind(this);
    // creates local function that binds this (booksTable object) to its filterRows method
    inputs.forEach((input) => {
      input.addEventListener("focusin", () => {
        // when input is focused adds event listener for keyup
        input.addEventListener("keyup", filter);
      });
      input.addEventListener("focusout", () => {
        // removes keyup listener when input is not focused
        input.removeEventListener("keyup", filter);
      });
    });
    try {
      this.renderRows();
    } catch (error) {
      console.error(error);
    }
  }
  // if there is a lot of data "keyup" event should be replaced with "change" - less convenient for user, but with a lot of data filtering on "keyup" may result in performance problems

  checkData(data) {
    let keyErrorIndex = -1; // variable to store on which index of data array there is eventual problem with object keys
    let valueErrorIndex = -1; // variable to store on which index of data array there is eventual problem with object values
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
    } else if (
      // checks if each book object has correct keys
      !data.every((book) => {
        keyErrorIndex++; // points which array index is currently checked
        return this.checkBookKeys(book);
      })
    ) {
      throw new Error(
        `Incorrect data key on index ${keyErrorIndex} in data array`
      );
    } else if (
      // checks if each book object has correct value types and date format
      !data.every((book) => {
        valueErrorIndex++; // points which array index is currently checked
        return this.checkBookValues(book);
      })
    ) {
      throw new Error(
        `Incorrect data value on index ${valueErrorIndex} in data array`
      );
    } else {
      return data;
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

  getData(data) {
    try {
      return this.checkData(data);
    } catch (error) {
      console.error(error);
    }
  }

  getInputValue(input) {
    return document.querySelector(`[data-column="${input}"]`).value;
  }

  updateInputValue(input) {
    this.inputValues[`${input}`] = this.getInputValue(input);
  }

  fillTemplate(book) {
    this.template.content.querySelector(".row__id--js").innerHTML = book.id;
    this.template.content.querySelector(".row__title--js").innerHTML =
      book.title;
    this.template.content.querySelector(".row__pages--js").innerHTML =
      book.pages;
    this.template.content.querySelector(".row__date--js").innerHTML = book.date;
    return this.template.content;
  }

  renderRows() {
    if (this.dataToPresent) {
      this.tableBody.innerHTML = ""; // clears table body
      this.dataToPresent.forEach((book, index) => {
        // pass index to catch where eventual errors are
        const row = document.importNode(this.fillTemplate(book, index), true);
        this.tableBody.appendChild(row);
      });
    } else {
      throw new Error("There is no dataToPresent");
    }
  }

  filterRows(event) {
    const column = event.target.dataset.column; // filtered column which input's value needs to be updated
    this.updateInputValue(column); // update inputValues property in booksTable object
    this.dataToPresent = this.data.filter((book) => {
      // checks each book from data if its every property value includes corresponding input value
      return Object.keys(book).every((key) => {
        return key === "pages"
          ? book[key].toString().includes(this.inputValues[key]) // changes "pages" value type from number to string and checks inclusion
          : book[key]
              .toLowerCase()
              .includes(this.inputValues[key].toLowerCase()); // changes string property values and input values to lower case and checks inclusion
      });
    });
    this.renderRows();
  }
}

const booksTable = new BooksTable(list);
console.log(booksTable);
