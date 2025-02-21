import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { HomeOutlined, SaveOutlined} from "@ant-design/icons";

export default function TemporaryDrawer() {
  let navigate = useNavigate();

  const handlePage = async (text) => {
    if (text == "Saved") navigate("/saved");
    else if (text == "Home") navigate("/");
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const menuItems = [
    { text: "Home", icon: <HomeOutlined style = {{fontSize: "20px" }}/> },
    { text: "Saved", icon: <SaveOutlined style = {{fontSize: "20px" }}/> },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {menuItems.map(({ text, icon }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handlePage(text)} sx={{ gap: 1 }}>
              <ListItemIcon
                sx={{ minWidth: 40, display: "flex", justifyContent: "center" }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          position: "absolute",
          left: 15,
          top: 15,
          cursor: "pointer",
        }}
        onClick={toggleDrawer(true)}
      >
        <img
          src="menu.png"
          alt="Menu"
          style={{
            width: "50px",
            height: "40px",
          }}
        />
      </Box>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </ThemeProvider>
  );
}
