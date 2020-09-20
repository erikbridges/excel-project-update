import React, { useState } from "react";
import "./App.css";
import { createEntry } from "./requests/requests";
function App() {
  let [state, setState] = useState({
    entryString: "",
  });
  const changeEntryString = (e) => {
    return setState({ ...state, [e.target.name]: e.target.value });
  };
  const submitContents = async () => {
    const entryRequest = await createEntry(state.entryString);
    if (entryRequest.success) {
      // Request is successful
    } else {
      // Request is unsuccessful throw an error.
    }
  };
  return (
    <div className="App">
      <div className="text-content">
        <div className="text-input">
          <textarea
            onChange={(e) => changeEntryString(e)}
            name="entryString"
            placeholder="Enter your name, phone number, cash app and number of spots."
          ></textarea>
        </div>
        <button onClick={() => submitContents()}>Submit</button>
      </div>
    </div>
  );
}

export default App;
