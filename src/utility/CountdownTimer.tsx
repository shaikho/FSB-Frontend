import React, { useState, useEffect } from "react";
type TCountdownTimer = {
  setResend: React.Dispatch<React.SetStateAction<boolean>>;
  setReqId: React.Dispatch<React.SetStateAction<string | undefined>>;
  resend: boolean;
  tries: number;
};

function CountdownTimer({
  setResend,
  setReqId,
  resend,
  tries,
}: TCountdownTimer) {
  const [seconds, setSeconds] = useState(
    tries === 0 && resend === true ? 0 : 1800
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          setReqId(undefined);
          setResend(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setResend, setReqId]);

  const formatTime = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const second = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${second}`;
  };
  return <span>{formatTime(seconds)}</span>;
}

export default CountdownTimer;
