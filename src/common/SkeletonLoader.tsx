import { Box, Skeleton } from "@mui/material";
import { memo } from "react";

const SkeletonLoader = memo(() => (
  <Box sx={{ p: 2 }}>
    {[...Array(2)].map((_, i) => (
      <Box key={i} sx={{ mb: 2 }}>
        <Skeleton variant="text" height={32} sx={{ mb: 1, borderRadius: 1 }} />
        <Skeleton variant="text" width="60%" />
      </Box>
    ))}
  </Box>
));

export default SkeletonLoader;
