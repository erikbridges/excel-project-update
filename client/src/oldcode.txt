import React, { useState } from "react";
import "./App.css";
import { createEntry } from "./requests/requests";
function App() {
  let [state, setState] = useState({
    entryString: "",
    loading: false,
    success: false,
  });
  const changeEntryString = (e) => {
    return setState({ ...state, [e.target.name]: e.target.value });
  };
  const submitContents = async () => {
    setState({ ...state, loading: true });
    const entryRequest = await createEntry(state.entryString);
    if (entryRequest.success) {
      // Request is successful
      setState({ ...state, loading: false, success: true, error: false });
      setTimeout(() => setState({ ...state, success: false }), 5000);
    } else {
      // Request is unsuccessful throw an error.true
      setState({ ...state, loading: false, success: false, error: true });
      setTimeout(() => setState({ ...state, error: false }), 3000);
    }
  };
  return (
    <div className="App">
      {state.error ? (
        <p
          style={{
            color: "red",
            display: "block",
            textAlign: "center",
            padding: 10,
          }}
        >
          Unable to create entry. Please try again.
        </p>
      ) : null}
      {state.success ? (
        <p
          style={{
            color: "green",
            display: "block",
            textAlign: "center",
            padding: 10,
          }}
        >
          Entry Successful.
        </p>
      ) : null}
      <div className="text-content">
        <div className="text-input">
          <textarea
            onChange={(e) => changeEntryString(e)}
            name="entryString"
            placeholder="Enter your name, phone number, cash app and number of spots."
          ></textarea>
        </div>
        {state.loading ? (
          <button disabled>Loading...</button>
        ) : (
          <button onClick={() => submitContents()}>Submit</button>
        )}
        ;
      </div>
    </div>
  );
}

export default App;
