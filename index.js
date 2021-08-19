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
];

class BooksTable {
  constructor(data) {
    this.data = data;
    this.tableBody = document.querySelector(".table__body--js");
    this.template = document.querySelector(".template--js");
  }

  fillTemplate(book) {
    this.template.content.querySelector(".row__id--js").innerHTML = book.id;
    this.template.content.querySelector(".row__title--js").innerHTML =
      book.polishTitle;
    this.template.content.querySelector(".row__pages--js").innerHTML =
      book.numberOfPages;
    this.template.content.querySelector(".row__date--js").innerHTML =
      book.releaseDate;
    return this.template.content;
  }

  createRows() {
    this.data.forEach((book) => {
      const row = document.importNode(this.fillTemplate(book), true);
      this.tableBody.appendChild(row);
    });
  }
}

const table = new BooksTable(list);
console.log(table);

table.createRows();
