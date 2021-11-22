import axios from "axios";
import { prod } from "../prod";

// const easyURL = "https://sudoku1v1.herokuapp.com/sudoku/easy";
// const mediumURL = "https://sudoku1v1.herokuapp.com/sudoku/medium";
// const testURL = "https://sudoku1v1.herokuapp.com/sudoku/test";
// const userURL = "https://sudoku1v1.herokuapp.com/sudoku/users";

const easyURL = prod ? "https://sudoku1v1.herokuapp.com/sudoku/easy" : "http://localhost:5000/sudoku/easy";
const mediumURL = prod ? "https://sudoku1v1.herokuapp.com/sudoku/medium" : "http://localhost:5000/sudoku/medium";
const testURL = prod ? "https://sudoku1v1.herokuapp.com/sudoku/test" : "http://localhost:5000/sudoku/test";
const userURL = prod ? "https://sudoku1v1.herokuapp.com/sudoku/users" : "http://localhost:5000/sudoku/users";

export const fetchEasyBoard = () => axios.get(easyURL);
export const fetchMediumBoard = () => axios.get(mediumURL);
export const fetchTestBoard = () => axios.get(testURL);
export const fetchUsers = () => axios.get(userURL);
