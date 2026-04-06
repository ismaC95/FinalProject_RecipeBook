//Displaying recipes in Discovery and My Recipes pages
import { useState } from "react";
import { useSortedRecipes } from "../../hooks/useSortedRecipes";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import RecipeCardSkeleton from "./RecipeCardSkeleton";
import RecipeCard from "./RecipeCard";

function RecipeGrid({ recipes = [], loading = false, error = "" }) {
  const [sortBy, setSortBy] = useState("newest");
  const sortedRecipes = useSortedRecipes(recipes, sortBy);

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

      {/* Error */}
      {error && (
        <Typography color="error" textAlign="center" mt={4}>
          {error}
        </Typography>
      )}

      {/* Recipe grid */}
      <Box display="flex" justifyContent={"center"} flexWrap="wrap" gap={2}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))
          : sortedRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
      </Box>

      {/* When there are no recipes */}
      {!loading && !error && recipes.length === 0 && (
        <Box textAlign="center" mt={8}>
          <Typography fontSize="3rem">🍳</Typography>
          <Typography fontWeight={700} mt={1}>
            No recipes yet
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Be the first to add one!
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default RecipeGrid;
