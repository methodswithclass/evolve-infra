import React from "react";
import { BrowserRouter } from "react-router-dom";
import { overrideConsole } from "./app/utils/utils";
import Routes from "./app/routes";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import "./styles/index.scss";

function App() {
  const { REACT_APP_ENV: env } = process.env;
  overrideConsole(env !== "local");
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
