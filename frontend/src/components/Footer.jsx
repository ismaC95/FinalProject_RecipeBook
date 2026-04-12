import { Box, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";

function Footer() {
  const navigate = useNavigate();

  const links = {
    Explore: [
      { label: "Discover recipes", path: "/discover" },
      { label: "Create a recipe", path: "/create-recipe" },
      { label: "My recipes", path: "/my-recipes" },
    ],
    Account: [
      { label: "Profile", path: "/profile" },
      { label: "Login", path: "/login" },
      { label: "Register", path: "/register" },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#1E6B52", color: "white", mt: "auto" }}
    >
      <Box sx={{ width: "100%" }}>
        <Grid container>
          <Grid
            size={{ xs: 12, md: 8 }}
            offset={{ md: 2 }}
            px={{ xs: 4, md: 0 }}
          >
            {/* Top section */}
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={6}
              py={6}
            >
              {/* Brand */}
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  letterSpacing=".1rem"
                  mb={1}
                  sx={{ cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  Umamade
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    maxWidth: 220,
                    lineHeight: 1.7,
                  }}
                >
                  Your home for homemade recipes. Create, discover and share
                  dishes you love.
                </Typography>
              </Box>

              {/* Links */}
              <Box display="flex" gap={8} flexWrap="wrap">
                {Object.entries(links).map(([section, items]) => (
                  <Box key={section}>
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      mb={2}
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        fontSize: "1rem",
                      }}
                    >
                      {section}
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={1}>
                      {items.map((item) => (
                        <Typography
                          key={item.label}
                          variant="body1"
                          onClick={() => navigate(item.path)}
                          sx={{
                            color: "rgba(255,255,255,0.8)",
                            cursor: "pointer",
                            "&:hover": { color: "white" },
                            transition: "color 0.2s",
                          }}
                        >
                          {item.label}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

            {/* Bottom section */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              py={3}
            >
              {/* <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.5)" }}
              >
                © {new Date().getFullYear()} Umamade. All rights reserved.
              </Typography> */}
              <Typography
                variant="body1"
                sx={{ color: "rgba(255,255,255,0.5)" }}
              >
                Made with love and umami 🍜
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Footer;
