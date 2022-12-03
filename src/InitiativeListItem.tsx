import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Input from "@mui/material/Input";

import { InitiativeItem } from "./InitiativeItem";

type InitiativeListItemProps = {
  initiative: InitiativeItem;
  onCountChange: (count: string) => void;
};

function InitiativeListItem({
  initiative,
  onCountChange,
}: InitiativeListItemProps) {
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
        pr: 64,
      }}
    >
      <ListItemText primary={initiative.name} />
    </ListItem>
  );
}

export default InitiativeListItem;
