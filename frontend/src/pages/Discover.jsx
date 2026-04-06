//Page with all recipes where user can search and filter them
import RecipeGrid from "../components/recipes/RecipeGrid";
import { getRecipes } from "../services/api";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";

function Discover() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <Box width="100%">
      <RecipeGrid recipes={recipes} loading={loading} error={error} />
    </Box>
  );
}

export default Discover;
