export class Validator {
  constructor(data) {
    this.data = data;
  }

  validate() {
    // public class - should return data or catch error
    try {
      return this._checkData(this.data);
    } catch (error) {
      console.error(error);
    }
  }

  _checkData(data) {
    const checkBookKeys = (book) => {
      // checks if book passed into function has proper keys, returns true if ok
      const properKeys = ["id", "title", "pages", "date"];
      const bookKeys = Object.keys(book);
      return (
        Array.isArray(bookKeys) &&
        bookKeys.length === properKeys.length &&
        bookKeys.every((key, index) => key === properKeys[index])
      );
    };
    const checkBookValues = (book) => {
      // checks if types of book's values and date format are ok, returns true if ok
      const dateRegex = new RegExp("^\\d{4}-\\d{2}-\\d{2}$");
      return (
        typeof book.id === "string" &&
        typeof book.title === "string" &&
        typeof book.pages === "number" &&
        typeof book.date === "string" &&
        dateRegex.test(book.date)
      );
    };
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
        return checkBookKeys(book);
      })
    ) {
      throw new Error(
        `Incorrect data key on index ${keyErrorIndex} in data array`
      );
    } else if (
      // checks if each book object has correct value types and date format
      !data.every((book) => {
        valueErrorIndex++; // points which array index is currently checked
        return checkBookValues(book);
      })
    ) {
      throw new Error(
        `Incorrect data value on index ${valueErrorIndex} in data array`
      );
    } else {
      return data;
    }
  }
}
