import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Auth from "./views/Auth";
import TodoList from "./views/TodoList";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="App">
      {!token ? <Auth setToken={setToken} /> : <TodoList token={token} />}
    </div>
  );
}

export default App;
