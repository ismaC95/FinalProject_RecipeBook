import RecipeGrid from "../components/recipes/RecipeGrid";
import { getUserRecipes } from "../services/api";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

function MyRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [maxIngredients, setMaxIngredients] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getUserRecipes({
          search: search || undefined,
          difficulty: difficulty || undefined,
          maxTime: maxTime || undefined,
          maxIngredients: maxIngredients || undefined,
          page,
          limit: 12,
        });
        setRecipes(data.recipes);
        setPagination(data.pagination);
      } catch (err) {
        setError("Could not load your recipes.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search, difficulty, maxTime, maxIngredients, page]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };
  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    setPage(1);
  };
  const handleMaxTimeChange = (value) => {
    setMaxTime(value);
    setPage(1);
  };
  const handleMaxIngredientsChange = (value) => {
    setMaxIngredients(value);
    setPage(1);
  };
  const handleClearFilters = () => {
    setSearch("");
    setDifficulty("");
    setMaxTime("");
    setMaxIngredients("");
    setPage(1);
  };

  return (
    <Box width="100%">
      <Typography variant="h4" fontWeight={800} mb={1}>
        My recipes
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        All the recipes you've created
      </Typography>
      <RecipeGrid
        recipes={recipes}
        loading={loading}
        error={error}
        pagination={pagination}
        page={page}
        onPageChange={setPage}
        search={search}
        onSearchChange={handleSearchChange}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        maxTime={maxTime}
        onMaxTimeChange={handleMaxTimeChange}
        maxIngredients={maxIngredients}
        onMaxIngredientsChange={handleMaxIngredientsChange}
        onClearFilters={handleClearFilters}
        emptyMessage="You haven't created any recipes yet"
        emptyIcon="👨‍🍳"
        emptyAction={{
          label: "Create your first recipe",
          path: "/create-recipe",
        }}
      />
    </Box>
  );
}

export default MyRecipes;
