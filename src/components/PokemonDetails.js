import React, { useState, useEffect, useCallback } from "react";
import {
  useTheme,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
} from "@mui/material";
import axios from "axios";
import _ from "lodash";

function convertHeightToFeetInches(decimeters) {
  const feet = decimeters * 0.328084;
  const wholeFeet = Math.floor(feet);
  const inches = Math.round((feet - wholeFeet) * 12);
  return `${wholeFeet}' ${inches}"`;
}

function convertWeightToPounds(hectograms) {
  return Math.round(hectograms * 0.220462);
}

const fetchPokemonDetails = async (search) => {
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`,
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch Pokémon details");
  }
};

const PokemonDetails = ({ searchTerm }) => {
  const theme = useTheme();
  const [pokemon, setPokemon] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [animatedSprites, setAnimatedSprites] = useState([]);
  const [officialArtwork, setOfficialArtwork] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const extractSprites = useCallback((sprites) => {
    let gifs = [];
    const generationV =
      sprites.versions["generation-v"]["black-white"].animated;
    if (generationV) {
      Object.keys(generationV).forEach((key) => {
        if (
          generationV[key] &&
          (key.endsWith("default") || key.endsWith("shiny"))
        ) {
          gifs.push(generationV[key]);
        }
      });
    }
    setAnimatedSprites(gifs);
  }, []);

  const fetchPokemon = useCallback(() => {
    const debouncedFetch = _.debounce(async (search) => {
      if (!search) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonDetails(search);
        setPokemon(data);
        extractSprites(data.sprites);
        setOfficialArtwork(
          data.sprites.other["official-artwork"].front_default,
        );

        const abilityPromises = data.abilities.map((ability) =>
          axios.get(ability.ability.url),
        );
        const abilitiesData = await Promise.all(abilityPromises);
        setAbilities(
          abilitiesData.map((res) => {
            const { name, effect_entries } = res.data;
            const effectEntry = effect_entries.find(
              (entry) => entry.language.name === "en",
            );
            return {
              name,
              effect: effectEntry
                ? effectEntry.effect
                : "No effect description available.",
            };
          }),
        );
      } catch (err) {
        console.error("Failed to fetch data for:", search, err);
        setError("Failed to load Pokémon details.");
        setPokemon(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    debouncedFetch(searchTerm);
  }, [searchTerm, extractSprites]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  if (isLoading) {
    return (
      <Typography
        variant="h6"
        sx={{ mt: 2, textAlign: "center", color: theme.palette.text.primary }}
      >
        Loading...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        sx={{ mt: 2, textAlign: "center", color: theme.palette.text.primary }}
      >
        {error}
      </Typography>
    );
  }

  if (!pokemon) {
    return (
      <Typography
        variant="h6"
        sx={{ mt: 2, textAlign: "center", color: theme.palette.text.primary }}
      >
        No Pokémon details available
      </Typography>
    );
  }

  if (!pokemon) {
    return (
      <Typography
        variant="h6"
        sx={{ mt: 2, textAlign: "center", color: theme.palette.text.primary }}
      >
        No Pokémon details available
      </Typography>
    );
  }

  return (
    <Card
      sx={{
        maxWidth: 800,
        my: 2,
        mx: "auto",
        background: theme.palette.background.paper,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ textAlign: "center", color: theme.palette.text.primary }}
        >
          {pokemon.name.toUpperCase()} (# {pokemon.id})
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Avatar
            src={officialArtwork}
            alt={`${pokemon.name} official artwork`}
            sx={{ width: 200, height: 200 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
            mt: 2,
          }}
        >
          {animatedSprites.map((sprite, index) => (
            <Avatar
              key={index}
              src={sprite}
              alt={`${pokemon.name} animated sprite`}
              sx={{ width: 56, height: 56 }}
            />
          ))}
        </Box>
        <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                textAlign: "center",
              }}
            >
              Height: {convertHeightToFeetInches(pokemon.height)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.text.primary,
                textAlign: "center",
              }}
            >
              Weight: {convertWeightToPounds(pokemon.weight)} lbs
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Abilities:
            </Typography>
            <List>
              {abilities.map((ability, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={ability.name}
                    secondary={ability.effect}
                    primaryTypographyProps={{
                      style: { color: theme.palette.text.primary },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Moves:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
              {pokemon.moves.map((move, index) => (
                <Chip
                  key={index}
                  label={move.move.name}
                  variant="outlined"
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.text.primary,
                  }}
                />
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.text.primary }}
            >
              Stats:
            </Typography>
            {pokemon.stats.map((stat) => (
              <Chip
                key={stat.stat.name}
                label={`${stat.stat.name.toUpperCase()}: ${stat.base_stat}`}
                variant="outlined"
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.text.primary,
                }}
              />
            ))}
          </Grid>
        </Grid>
        <audio
          controls
          src={pokemon.cries.latest}
          style={{
            width: "100%",
            marginTop: "20px",
            color: theme.palette.text.primary,
          }}
        >
          Your browser does not support the audio element.
        </audio>
      </CardContent>
    </Card>
  );
};

export default PokemonDetails;
