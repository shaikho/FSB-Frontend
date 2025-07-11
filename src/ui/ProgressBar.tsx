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
  const { personalInfoStep } = useNavigation();

  let progress =
    currentStep.step === 1 || currentStep.step === 2
      ? 10
      : (currentStep.step - 1) * 14.28571428571429;

  progress = progress > 0 ? progress - 10 : progress;
  progress = Math.round(progress / 5) * 5;

  if (currentStep.title === "/personal-info" && personalInfoStep === 1) {
    progress = 10;
  } else if (currentStep.title === "/personal-info" && personalInfoStep === 2) {
    progress = 15;
  } else if (currentStep.title === "/display-personal-info") {
    progress = 80;
  } else if (currentStep.title === "/signeture") {
    progress = 90;
  }

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
