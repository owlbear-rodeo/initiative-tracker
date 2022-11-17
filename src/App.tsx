import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SkipNextRounded from "@mui/icons-material/SkipNextRounded";

import OBR, { Item } from "@owlbear-rodeo/sdk";

import { InitiativeItem } from "./InitiativeItem";

import addIcon from "./assets/add.svg";
import removeIcon from "./assets/remove.svg";

import InitiativeListItem from "./InitiativeListItem";
import { getPluginId } from "./getPluginId";

function App() {
  const [initiativeItems, setInitiativeItems] = useState<InitiativeItem[]>([]);

  useEffect(() => {
    const handleItemsChange = (items: Item[]) => {
      const initiativeItems: InitiativeItem[] = [];
      for (const item of items) {
        const metadata = item.metadata[getPluginId("metadata")];
        if (metadata !== undefined) {
          initiativeItems.push({
            id: item.id,
            count: metadata.count,
            name: item.name,
            active: metadata.active,
          });
        }
      }
      setInitiativeItems(initiativeItems);
    };

    OBR.scene.items.getItems(() => true).then(handleItemsChange);
    return OBR.scene.items.onChange(handleItemsChange);
  }, []);

  useEffect(() => {
    OBR.contextMenu.create({
      icons: [
        {
          icon: addIcon,
          label: "Add to Initiative",
          filter: {
            min: 1,
            every: [
              { key: "type", value: "IMAGE" },
              { key: "layer", value: "CHARACTER" },
              { key: ["metadata", getPluginId("metadata")], value: undefined },
            ],
            roles: ["GM"],
          },
        },
        {
          icon: removeIcon,
          label: "Remove from Initiative",
          filter: {
            min: 1,
            every: [
              { key: "type", value: "IMAGE" },
              { key: "layer", value: "CHARACTER" },
            ],
            roles: ["GM"],
          },
        },
      ],
      id: getPluginId("menu/toggle"),
      onClick(context) {
        OBR.scene.items.updateItems(
          context.items.map((i) => i.id),
          (items) => {
            // Check whether to add the items to initiative or remove them
            const addToInitiative = items.every(
              (item) => item.metadata[getPluginId("metadata")] === undefined
            );
            let count = 0;
            for (let item of items) {
              if (addToInitiative) {
                item.metadata[getPluginId("metadata")] = {
                  count: `${count}`,
                  active: false,
                };
                count += 1;
              } else {
                delete item.metadata[getPluginId("metadata")];
              }
            }
          }
        );
      },
    });
  }, []);

  function handleNextClick() {
    // Get the next index to activate
    const sorted = initiativeItems.sort(
      (a, b) => parseFloat(b.count) - parseFloat(a.count)
    );
    const nextIndex =
      (sorted.findIndex((initiative) => initiative.active) + 1) % sorted.length;

    // Set local items immediately
    setInitiativeItems((prev) => {
      return prev.map((init, index) => ({
        ...init,
        active: index === nextIndex,
      }));
    });
    // Update the scene items with the new active status
    OBR.scene.items.updateItems(
      initiativeItems.map((init) => init.id),
      (items) => {
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          if (item.metadata[getPluginId("metadata")]) {
            item.metadata[getPluginId("metadata")].active = i === nextIndex;
          }
        }
      }
    );
  }

  function handleInitiativeCountChange(id: string, newCount: string) {
    // Set local items immediately
    setInitiativeItems((prev) =>
      prev.map((initiative) => {
        if (initiative.id === id) {
          return {
            ...initiative,
            count: newCount,
          };
        } else {
          return initiative;
        }
      })
    );
    // Sync changes over the network
    OBR.scene.items.updateItems([id], (items) => {
      for (let item of items) {
        if (item.metadata[getPluginId("metadata")]) {
          item.metadata[getPluginId("metadata")].count = newCount;
        }
      }
    });
  }

  return (
    <Stack height="100vh">
      <CardHeader
        title="Initiative"
        action={
          <IconButton
            aria-label="next"
            onClick={handleNextClick}
            disabled={initiativeItems.length === 0}
          >
            <SkipNextRounded />
          </IconButton>
        }
        titleTypographyProps={{
          sx: { fontSize: "1.125rem", fontWeight: "bold" },
        }}
      />
      <Divider variant="middle" />
      {initiativeItems.length === 0 && (
        <Typography
          variant="caption"
          sx={{ px: 2, py: 1, opacity: 0.5, display: "inline-block" }}
        >
          Select a character to start initiative
        </Typography>
      )}
      <List sx={{ overflowY: "auto" }}>
        {initiativeItems
          .sort((a, b) => parseFloat(b.count) - parseFloat(a.count))
          .map((initiative) => (
            <InitiativeListItem
              key={initiative.id}
              initiative={initiative}
              onCountChange={(newCount) => {
                handleInitiativeCountChange(initiative.id, newCount);
              }}
            />
          ))}
      </List>
    </Stack>
  );
}

export default App;
