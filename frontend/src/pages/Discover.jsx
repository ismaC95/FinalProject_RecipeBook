//Page with all recipes where user can search and filter them

import { getRecipes } from "../services/api";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

function Discover() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getRecipes();
        setRecipes(data.recipes);
      } catch (err) {
        setError("Could not load recipes.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <Box>
      {/* Header + sort */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h6" fontWeight={700}>
          {loading
            ? "Loading recipes..."
            : `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""}`}
        </Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
            <MenuItem value="title_asc">Title A → Z</MenuItem>
            <MenuItem value="title_desc">Title Z → A</MenuItem>
            <MenuItem value="difficulty_asc">Easiest first</MenuItem>
            <MenuItem value="difficulty_desc">Hardest first</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default Discover;
