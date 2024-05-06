import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardMedia, Grid, Chip, Box, List, ListItem, ListItemText, Avatar, Stack } from '@mui/material';

const fetchDetails = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        return null;
    }
};

const PokemonDetails = ({ searchTerm }) => {
    const [pokemon, setPokemon] = useState(null);
    const [abilities, setAbilities] = useState([]);
    const [animatedSprites, setAnimatedSprites] = useState([]);
    const [officialArtwork, setOfficialArtwork] = useState('');

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
                const data = response.data;
                setPokemon(data);
                extractSprites(data.sprites);
                setOfficialArtwork(data.sprites.other['official-artwork'].front_default);

                const abilityPromises = data.abilities.map(ability => fetchDetails(ability.ability.url));
                const abilityDetails = await Promise.all(abilityPromises);
                setAbilities(abilityDetails.map(detail => ({
                    name: detail.name,
                    effect: detail.effect_entries.find(entry => entry.language.name === 'en').effect
                })));
            } catch (err) {
                console.error('Failed to fetch data for:', searchTerm, err);
                setPokemon(null);
            }
        };

        if (searchTerm) {
            fetchPokemon();
        }
    }, [searchTerm]);

    const extractSprites = (sprites) => {
        let gifs = [];
        Object.values(sprites).forEach(sprite => {
            if (typeof sprite === 'string' && sprite.endsWith('.gif')) {
                gifs.push(sprite);
            } else if (typeof sprite === 'object' && sprite !== null) {
                Object.values(sprite).forEach(subSprite => {
                    if (typeof subSprite === 'string' && subSprite.endsWith('.gif')) {
                        gifs.push(subSprite);
                    }
                });
            }
        });
        setAnimatedSprites(gifs);
    };

    if (!pokemon) {
        return <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>No Pokémon details available</Typography>;
    }

    return (
        <Card sx={{ maxWidth: 800, my: 2, mx: 'auto', background: 'linear-gradient(145deg, #f3f4f6, #ffffff)', boxShadow: 3 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                    {pokemon.name.toUpperCase()} (ID: {pokemon.id})
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                    {animatedSprites.map((sprite, index) => (
                        <Avatar key={index} src={sprite} alt={`${pokemon.name} sprite`} sx={{ width: 56, height: 56 }} />
                    ))}
                    {officialArtwork && (
                        <CardMedia component="img" image={officialArtwork} alt={`${pokemon.name} official artwork`} sx={{ width: 200, height: 200, borderRadius: '50%' }} />
                    )}
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Height:</Typography>
                        <Typography paragraph>{pokemon.height * 10} cm</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Weight:</Typography>
                        <Typography paragraph>{pokemon.weight / 10} kg</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Abilities:</Typography>
                        <List>
                            {abilities.map((ability, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={ability.name} secondary={ability.effect} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Moves:</Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 2 }}>
                            {pokemon.moves.map((move, index) => (
                                <Chip key={index} label={move.move.name} variant="outlined" />
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Stats:</Typography>
                        {pokemon.stats.map(stat => (
                            <Chip key={stat.stat.name} label={`${stat.stat.name.toUpperCase()}: ${stat.base_stat}`} variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                    </Grid>
                </Grid>
                <audio controls src={pokemon.cries.latest} style={{ width: '100%', marginTop: '20px' }}>
                    Your browser does not support the audio element.
                </audio>
            </CardContent>
        </Card>
    );
};

export default PokemonDetails;
