import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import _ from "lodash";

const PokemonAutocomplete = ({ inputValue, onChange, onSelect }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allPokemon, setAllPokemon] = useState([]);
  const [validPokemonIds, setValidPokemonIds] = useState(new Set());
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=100000`)
      .then((response) => {
        const names = response.data.results.map((pokemon) => pokemon.name);
        setAllPokemon(names);

        const ids = response.data.results.map((pokemon) => {
          const urlParts = pokemon.url.split("/");
          return parseInt(urlParts[urlParts.length - 2], 10);
        });
        setValidPokemonIds(new Set(ids)); // Store valid IDs in a Set for quick lookup
      })
      .catch((error) => console.error("Error fetching Pokémon names:", error))
      .finally(() => setLoading(false));
  }, []);

  // Memoize isValidId using useCallback
  const isValidId = useCallback(
    (input) => {
      const num = parseInt(input, 10);
      return !isNaN(num) && validPokemonIds.has(num);
    },
    [validPokemonIds],
  );

  useEffect(() => {
    const debounceLoadData = _.debounce((input) => {
      if (!input) {
        setOptions([]);
        return;
      }
      const normalizedInput = input.toLowerCase().trim();
      const filteredOptions = allPokemon.filter(
        (name) => name.startsWith(normalizedInput) || isValidId(input),
      );
      setOptions(filteredOptions);
    }, 500);
    debounceLoadData(inputValue);
  }, [inputValue, allPokemon, isValidId]);

  const handleInputChange = (event, newValue) => {
    onChange(newValue);
  };

  const handleSelectionChange = (event, newValue) => {
    if (allPokemon.includes(newValue.toLowerCase()) || isValidId(newValue)) {
      onSelect(newValue);
    }
  };

  return (
    <Autocomplete
      freeSolo
      disableClearable
      id="pokemon-search"
      options={options}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelectionChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Enter Pokémon ID or Name"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
              },
            },
            "& label": {
              color: theme.palette.text.primary,
            },
            "& .MuiInputBase-input": {
              color: theme.palette.text.primary,
            },
          }}
        />
      )}
    />
  );
};

export default PokemonAutocomplete;
