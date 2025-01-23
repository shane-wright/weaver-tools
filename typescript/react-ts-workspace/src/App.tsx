import React from "react";
import CustomButton from "./components/Button";

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>My React App</h1>
      <CustomButton onClick={() => alert("Button clicked!")}>Click Me</CustomButton>
    </div>
  );
};

export default App;
