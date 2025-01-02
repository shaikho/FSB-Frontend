import { Box, Grid, Skeleton } from "@mui/material";
export default function Loading() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "80px 1fr",
        height: "100%",
        width: "100%",
      }}
    >
      <Box></Box>
      <Box sx={{ padding: "20px", minHeight: "calc(100dvh - 80px)" }}>
        <Box
          component="div"
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
          }}
        >
          <Skeleton
            variant="rectangular"
            height={15}
            sx={{ borderRadius: 10 }}
          />
          <Grid
            container
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            <Skeleton variant="text" height={40} width="100%" />
            <Skeleton variant="rectangular" height={400} width="100%" />
          </Grid>
          <Grid container alignSelf="flex-end" justifyContent="space-between">
            <Skeleton
              variant="rectangular"
              width={80}
              height={40}
              sx={{ borderRadius: "5px" }}
            />
            <Skeleton
              variant="rectangular"
              width={80}
              height={40}
              sx={{ borderRadius: "5px" }}
            />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
