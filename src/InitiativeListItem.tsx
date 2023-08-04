import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Input from "@mui/material/Input";
import ListItemIcon from "@mui/material/ListItemIcon";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

import { InitiativeItem } from "./InitiativeItem";

type InitiativeListItemProps = {
  initiative: InitiativeItem;
  onCountChange: (count: string) => void;
  showHidden: boolean;
};

export function InitiativeListItem({
  initiative,
  onCountChange,
  showHidden,
}: InitiativeListItemProps) {
  if (!initiative.visible && !showHidden) {
    return null;
  }

  return (
    <ListItem
      key={initiative.id}
      secondaryAction={
        <Input
          disableUnderline
          sx={{ width: 48 }}
          inputProps={{
            sx: {
              textAlign: "right",
            },
          }}
          value={initiative.count}
          onChange={(e) => {
            const newCount = e.target.value;
            onCountChange(newCount);
          }}
        />
      }
      divider
      selected={initiative.active}
      sx={{
        pr: "64px",
      }}
    >
      {!initiative.visible && showHidden && (
        <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
          <VisibilityOffRounded fontSize="small" />
        </ListItemIcon>
      )}
      <ListItemText sx={{ color: "text.primary" }} primary={initiative.name} />
    </ListItem>
  );
}
