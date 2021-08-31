import { Validator } from "./Validator.js";

export class BooksTable {
  constructor(data) {
    this.data = this.getData(data); // pure (but formated) data from json
    this.dataToPresent = this.data; // data used to render rows to table - initially the same as data, but can be filtered
    this.tableBody = document.querySelector(".table__body--js");
    this.templateRow = document.querySelector(".template__row--js");
    this.templateArrowUp = document.querySelector(".template__arrow-up--js");
    this.templateArrowDown = document.querySelector(
      ".template__arrow-down--js"
    );
    this.inputValues = {
      id: this.getInputValue("id"),
      title: this.getInputValue("title"),
      pages: this.getInputValue("pages"),
      date: this.getInputValue("date"),
    };
    this.sorting = { sorted: false, column: null, rising: true };

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
    // adds event listeners to table headers for sorting
    const tableHeaders = document.querySelectorAll(".table-header--js");
    tableHeaders.forEach((header) => {
      header.addEventListener("click", (event) => {
        this.sorting.sorted = true;
        this.sorting.rising =
          this.sorting.column === event.target.closest("th").dataset.column // checks if data has been previously sorted by the same column...
            ? !this.sorting.rising // ...if it has - changes the sorting order
            : true; // ...if it hasn't - sets order to rising
        this.sorting.column = event.target.closest("th").dataset.column;
        this.handleSortingArrow();
        this.renderRows();
      });
    });
    console.log(this);

    try {
      this.renderRows();
    } catch (error) {
      console.error(error);
    }
  }
  // if there is a lot of data "keyup" event should be replaced with "change" - less convenient for user, but with a lot of data filtering on "keyup" may result in performance problems

  getData(data) {
    return new Validator(data).validate();
  }

  getInputValue(input) {
    return document.querySelector(`.filter__input--js[data-column="${input}"]`)
      .value;
  }

  updateInputValue(input) {
    this.inputValues[`${input}`] = this.getInputValue(input);
  }

  fillTemplate(book) {
    this.templateRow.content.querySelector(".row__id--js").innerHTML = book.id;
    this.templateRow.content.querySelector(".row__title--js").innerHTML =
      book.title;
    this.templateRow.content.querySelector(".row__pages--js").innerHTML =
      book.pages;
    this.templateRow.content.querySelector(".row__date--js").innerHTML =
      book.date;
    return this.templateRow.content;
  }

  renderRows() {
    if (this.dataToPresent) {
      this.tableBody.innerHTML = ""; // clears table body
      this.sortRows();
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

  sortRows() {
    if (this.sorting.sorted) {
      const key = this.sorting.column;
      this.dataToPresent.sort((a, b) => {
        if (a[key] < b[key]) return this.sorting.rising ? -1 : 1;
        if (a[key] > b[key]) return this.sorting.rising ? 1 : -1;
        return 0;
      });
    }
  }

  handleSortingArrow() {
    if (this.sorting.sorted) {
      const oldArrow = document.querySelector(".arrow");
      if (oldArrow) oldArrow.remove(); // deletes any existing arrow
      const column = this.sorting.column;
      let arrow;
      if (this.sorting.rising) {
        // chooses the right arrow template (up or down) ----- TODO: change only class to rotate arrow
        arrow = document.importNode(this.templateArrowUp.content, true);
      } else {
        arrow = document.importNode(this.templateArrowDown.content, true);
      }
      const headerElement = document.querySelector(
        // checks on which column data is being sorted and adds arrow to the right one
        `.table-header--js[data-column="${column}"]`
      );
      headerElement.appendChild(arrow);
    }
  }
}
