import React, { useState } from "react";
import { CssBaseline, Box } from "@mui/material";
import PokemonDetails from "./components/PokemonDetails";
import PokemonAutocomplete from "./components/PokemonAutocomplete";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const handleSelect = (newValue) => {
    setSearchTerm(newValue || inputValue);
  };

  const appStyle = {
    padding: 4,
    minHeight: "100vh",
    background: "url(/pokemon/pokemon.jpg) no-repeat center center fixed",
    backgroundSize: "cover",
  };

  return (
    <>
      <CssBaseline />
      <Box sx={appStyle}>
        <PokemonAutocomplete
          inputValue={inputValue}
          onChange={handleInputChange}
          onSelect={handleSelect}
        />
        {searchTerm && <PokemonDetails searchTerm={searchTerm} />}
      </Box>
    </>
  );
}

export default App;
