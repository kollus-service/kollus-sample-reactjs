import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Input from "@mui/material/Input";

import FileUploadIcon from "@mui/icons-material/FileUpload";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function Template(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (open) => {
    return (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }

      setOpen(!open);
      if (open === false) {
        props.refreshContentsList();
        props.getContentsList();
      }
    };
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(open)}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => {
              document.location.href = "/";
            }}
            sx={{ cursor: "pointer" }}
          >
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        // variant="persistent"
        anchor="left"
        open={open}
        onClose={toggleDrawer(open)}
      >
        <DrawerHeader
          onClick={toggleDrawer(open)}
          sx={{ alignItems: "center" }}
        >
          <IconButton>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ cursor: "default" }}>
              <ListItemIcon>
                <FileUploadIcon
                  sx={{ cursor: "pointer" }}
                  onClick={props.uploadFile}
                />
              </ListItemIcon>
              <label htmlFor="contained-button-file">
                <Input
                  id="contained-button-file"
                  multiple
                  type="file"
                  name="content"
                  onChange={props.uploadFileSelect}
                  sx={{ display: "none" }}
                />
                <ListItemText
                  primary={props.selectedContentTitle}
                  sx={{ cursor: "pointer" }}
                />
              </label>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {props.contentsList.data.map((content, index) => {
            return (
              <ListItem
                key={content}
                disablePadding
                onClick={() => {
                  props.refresh();
                  props.initialMcKey(content.mckey);
                  props.getPlayInfo();
                  props.updateContentInfo();
                }}
              >
                <ListItemButton>
                  <ListItemText primary={content.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {props.main}
      </Main>
    </Box>
  );
}
