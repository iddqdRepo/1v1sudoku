import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import { getRoom, getAllUsers } from "../actions/sudokuActions";
import { useDispatch, useSelector } from "react-redux";
import { prod } from "../prod";
import { SocketContext } from "../context";

// const socket = io.connect(prod ? "https://sudoku-vercel-test-zkh1.vercel.app" : "http://localhost:5000");

function Homepage() {
  const socket = useContext(SocketContext)
  const [val, setVal] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [errorText, seterrorText] = useState("");
  let history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoom()); //dispatching the action from ./actions/posts - redux
    // dispatch(getAllUsers());
  }, [dispatch]);

  let roomId = useSelector((state) => state.roomCodeReducer);

  const createGame = () => {
    socket.emit("check_room", (error) => {
      if (error) console.log("ERROR CHECK_ROOM");
    });

    // console.log("difficulty selected = ", difficulty);

    if (!difficulty) {
      return console.log("please select a difficulty");
    }

    history.push({
      pathname: `/create`,
      search: `?roomCode=${roomId}`,
      state: {
        detail: difficulty,
      },
    });
  };

  const chooseDifficulty = (event) => {
    setDifficulty(event.target.value);
    console.log(event.target.value);
    console.log("difficulty is ", difficulty);
  };

  function asyncEmit() {
    console.log("In asyncEmit");
    return new Promise(function (resolve, reject) {
      socket.emit("check_room", () => {});
      socket.on("roomvalidationdata", (roomvalidationdata) => {
        resolve(roomvalidationdata);
      });
      setTimeout(reject, 1000);
    });
  }

  const joinGame = async () => {
    const result = await asyncEmit();

    const occurences = result.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    console.log("roomsCreated ", result);
    console.log("occurences ", occurences);
    console.log("occurences val ", occurences[val]);

    if (occurences[val] > 1) {
      seterrorText("Room Full");
      return console.log("ROOM FULL");
    }

    if (result.includes(val)) {
      console.log("RoomsCreated Data ", result);
      history.push({
        pathname: `/join`,
        search: `?roomCode=${val}`,
      });
    } else {
      console.log(val, "DOES NOT EXIST");
      return seterrorText(val + " does not exist");
    }
  };

  return (
    <div className="Home">
      <div className="Homepage-text-container">
        Welcome to 1v1 Sudoku.
        <br />
        <br />
        Go head to head with a friend to see who is better.
        <br />
        <br />
        Each player gets served the exact same board. <br />
        <br />
        Have Fun.
      </div>

      <div className="HomepageContainer">
        <div className="button-div">
          <p className="choose-difficulty-text">Choose a difficulty</p>
          <div className="switch-field" onChange={chooseDifficulty}>
            <input className="radio-input" type="radio" id="radio-three" name="switch-two" value="easy" />
            <label htmlFor="radio-three">Easy</label>
            <input className="radio-input" type="radio" id="radio-four" name="switch-two" value="medium" />
            <label htmlFor="radio-four">Medium</label>
            {/* <input className="radio-input" type="radio" id="radio-five" name="switch-two" value="test" />
            <label htmlFor="radio-five">Test</label> */}
          </div>
          <button className="main" onClick={() => createGame()}>
            Create Game
          </button>
        </div>
        <div className="button-div">
          <div className="error-text">{errorText}</div>
          <input
            className="JoinGameInput radio-input"
            placeholder="Enter game code"
            value={val}
            onInput={(e) => {
              setVal(e.target.value);
            }}
          ></input>
          <button className="main" onClick={() => joinGame()}>
            Join Game
          </button>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="HomepageContainer">
  //     <div className="CreateGameContainer">
  //       <button className="JoinCreateBtn" onClick={() => createGame()}>
  //         Create Game
  //       </button>
  //     </div>
  //     <div onChange={chooseDifficulty}>
  //       <div>
  //         <input type="radio" value="easy" name="gender" /> Easy
  //       </div>
  //       <div>
  //         <input type="radio" value="medium" name="gender" /> Med
  //       </div>
  //       <div>
  //         <input type="radio" value="test" name="gender" /> test
  //       </div>
  //     </div>

  //     <div className="JoinGameContainer">
  //       <button className="JoinCreateBtn" onClick={() => joinGame()}>
  //         Join Game
  //       </button>

  //       <input
  //         className="JoinGameInput"
  //         placeholder="Enter game code"
  //         value={val}
  //         onInput={(e) => {
  //           setVal(e.target.value);
  //         }}
  //       ></input>

  //       {errorText}
  //     </div>
  //   </div>
  // );
}

export default Homepage;
