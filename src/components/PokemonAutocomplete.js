import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';

const PokemonAutocomplete = ({ inputValue, onChange, onSelect }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!inputValue || !isNaN(inputValue)) {
            setOptions([]);  // Clear options if the input is a number or empty
            return;
        }

        setLoading(true);
        axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
            .then(response => {
                const names = response.data.results.map(pokemon => pokemon.name);
                setOptions(names);
            })
            .catch(error => console.error('Error fetching Pokémon names:', error))
            .finally(() => setLoading(false));
    }, [inputValue]);

    return (
        <Autocomplete
            freeSolo
            disableClearable
            id="pokemon-search"
            options={options}
            inputValue={inputValue}
            onInputChange={(event, newValue) => onChange(newValue)}
            onChange={(event, newValue) => onSelect(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Enter Pokémon ID or Name"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        backgroundColor: 'white', // Set background color
                        borderRadius: '4px', // Set the border radius
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: 'rgba(255,255,255,0.5)', // Lighter border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: 'rgba(255,255,255,0.8)', // Darker on hover
                        },
                        "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: 'white', // White border on focus
                        }
                    }}
                />
            )}
        />
    );
};

export default PokemonAutocomplete;
