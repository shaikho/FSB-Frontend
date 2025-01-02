import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Spinner() {
  return (
    <Box
      sx={{
        display: "Grid",
        position: "absolute",
        placeItems: "center",
        minHeight: "100%",
        width: "100%",
        zIndex: 1000,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
