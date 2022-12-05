// import React from "react";
// import { Link } from "react-router-dom";
// import Web3 from "web3";

// const Header = () => {
//   const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
//   const [account, setAccount] = React.useState();

//   React.useEffect(() => {
//     async function load() {
//       const accounts = await web3.eth.requestAccounts();
//       setAccount(accounts[0]);
//     }
//     load();
//   }, []);
//   window.ethereum.on("accountsChanged", async (account) => {
//     setAccount(account[0]);
//   });

//   return (
//     <nav className="navbar p-0 fixed-top d-flex flex-row custom-nav ">
//       <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
//         <ul className="navbar-nav navbar-nav-right ">
//           <li>{account}</li>
//           <li>
//             <h5>
//               {" "}
//               <Link to="/">Home</Link>{" "}
//             </h5>{" "}
//           </li>
//           <li>
//             <h5>
//               {" "}
//               <Link to="/event">Event</Link>
//             </h5>{" "}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Header;

import * as React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import Web3 from "web3";

const drawerWidth = 240;
const navItems = [
  { name: "Home", link: "/" },
  { name: "Event", link: "/event" },
];

function DrawerAppBar(props) {
  //   const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        ICO
      </Typography>
      <Divider />
      <List>
        {navItems.map(({ name, link }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  //   const container =
  //     window !== undefined ? () => window().document.body : undefined;

  //////////////
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

  const [account, setAccount] = React.useState();

  React.useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    }
    load();
  }, []);

  window.ethereum.on("accountsChanged", async (account) => {
    setAccount(account[0]);
  });
  //////////////////////////
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            ICO
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map(({ name, link }) => (
              <>
                <Link to={`${link}`}>
                  <Button key={name} sx={{ color: "#fff" }}>
                    {name}
                  </Button>
                </Link>
              </>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          //   container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
