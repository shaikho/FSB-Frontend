import React, { Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { Box, Skeleton } from "@mui/material";

interface LazyImageProps {
  src: string;
  alt: string;
  [key: string]: unknown;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...rest }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1, // Load the image when 10% of it is visible
  });

  return (
    <Box ref={ref} {...rest}>
      {inView && (
        <Suspense
          fallback={
            <Skeleton
              variant="rounded"
              sx={{ width: "200px", height: "200px" }}
            />
          }
        >
          <img
            src={src}
            alt={alt}
            style={{ height: "200px", objectFit: "contain" }}
          />
        </Suspense>
      )}
    </Box>
  );
};

export default LazyImage;
