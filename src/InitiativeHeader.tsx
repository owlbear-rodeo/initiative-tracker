import React from "react";

import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export function InitiativeHeader({
  subtitle,
  action,
}: {
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <>
      <CardHeader
        title="Initiative"
        action={action}
        titleTypographyProps={{
          sx: { fontSize: "1.125rem", fontWeight: "bold", lineHeight: "32px" },
        }}
      />
      <Divider variant="middle" />
      {subtitle && (
        <Typography
          variant="caption"
          sx={{ px: 2, py: 1, opacity: 0.5, display: "inline-block" }}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
}
