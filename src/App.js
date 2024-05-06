import React, { useState } from 'react';
import { CssBaseline, Box } from '@mui/material';
import PokemonDetails from './components/PokemonDetails';
import PokemonAutocomplete from './components/PokemonAutocomplete';

function App() {
    const [inputValue, setInputValue] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (newValue) => {
        setInputValue(newValue);
    };

    const handleSelect = (newValue) => {
        setSearchTerm(newValue || inputValue);
    };

    return (
        <>
            <CssBaseline />
            <Box sx={{
                padding: 4,
                backgroundColor: 'transparent',
                minHeight: '100vh'
            }}>
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
