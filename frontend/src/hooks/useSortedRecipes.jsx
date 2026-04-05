//Hook to sort the recipes display in different pages and components.

//Sort by:
//- CreatedAt (most recent or oldest)
//- Alphabetical order on the title
//- Difficulty

//useMemo is a hook that cache the results of the recipe sorting calculation and won't recalculate until the recipes or sorting methodology changes
import { useMemo } from "react";

//What is the order of difficulty? Easiest is the lowest and hard is the highest difficulty
const DIFFICULTY_ORDER = { Easy: 1, Medium: 2, Hard: 3 };

export const useSortedRecipes = (recipes, sortBy) => {
  return useMemo(() => {
    if (!recipes) return [];
    const sorted = [...recipes];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      case "title_asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title_desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "difficulty_asc":
        return sorted.sort(
          (a, b) =>
            DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
        );
      case "difficulty_desc":
        return sorted.sort(
          (a, b) =>
            DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty],
        );
      default:
        return sorted;
    }
  }, [recipes, sortBy]);
};
