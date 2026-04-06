import { Box, Skeleton } from "@mui/material";

//The skeleton will show only when the content is loading
function RecipeCardSkeleton() {
  return (
    <Box
      sx={{
        width: {
          xs: "100%",
          sm: "49%",
          md: "32%",
        },
      }}
    >
      <Skeleton variant="rounded" height={180} />
      <Box pt={1}>
        <Skeleton width="30%" height={24} />
        <Skeleton width="80%" height={24} />
        <Skeleton width="60%" height={20} />
      </Box>
    </Box>
  );
}

export default RecipeCardSkeleton;
