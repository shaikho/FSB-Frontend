import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigation } from "../contexts/NavigationProvider";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ paddingInlineStart: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ProgressBar() {
  const { currentStep } = useNavigation();
  const progress =
    currentStep.step === 1 || currentStep.step === 2
      ? 10
      : (currentStep.step - 1) * 10;

  return (
    <Box sx={{ overflow: "hidden" }}>
      <LinearProgressWithLabel
        id="progressbar"
        value={progress}
        color="primary"
        sx={{ height: 15, borderRadius: 10 }}
      />
    </Box>
  );
}
