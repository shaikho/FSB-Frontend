import { Paper } from "@mui/material";
import { PropsWithChildren } from "react";
import ProgressBar from "./ProgressBar";

type TMainLayoutProps = PropsWithChildren;
export default function MainLayout({ children }: TMainLayoutProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        padding: "20px",
        borderRadius: "10px 10px 0 0",
        // position: "relative",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <>
        <ProgressBar />
        {children}
      </>
    </Paper>
  );
}
