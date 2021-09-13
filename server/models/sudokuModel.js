import mongoose from "mongoose";
const Schema = mongoose.Schema;

//structure of the document
const sudokuSchema = new Schema({
  puzzle: [],
  difficulty: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

//Model provides us with an interface to communicate with the databse collection
//looks for the model name (Sudoku), pluralises it, the look for that collection inside the database
const SudokuEasy = mongoose.model("Sudokueasy", sudokuSchema);
const SudokuMeds = mongoose.model("Sudokumeds", sudokuSchema);

let modelExport = {
  SudokuEasy,
  SudokuMeds,
};

export default modelExport;

// module.exports = {
//     SudokuEasy,
//     SudokuMeds,
//   };
