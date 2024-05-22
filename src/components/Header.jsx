import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Tooltip } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import logo from './Images/logo.png';
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Header() {
  const [hoveredButton, setHoveredButton] = useState('');

   const handleSignOut = () => {
       alert("You have been signed out!");
   };

  return (
    <AppBar>
      <Toolbar className="app-bar">
        <Typography variant="h6">
          <img className="logo" src={logo} alt="Logo" />
        </Typography>

        <Typography variant="h6" className="nav-title">
          MMS Podcast
        </Typography>

        {/* Favorite Button */}
        <IconButton
          className="nav-button"
          color="inherit"
          aria-label="Favorite"
          onMouseOver={() => setHoveredButton("Favorite")}
          onMouseOut={() => setHoveredButton("")}
          style={{ color: hoveredButton === "Favorite" && "blue" }}
          onClick={handleSignOut}
        >
          <Tooltip title="favorite" placement="bottom">
            <FavoriteIcon />
          </Tooltip>
        </IconButton>
        
        {/* Sign Out Button */}

        <IconButton
          className="nav-button"
          color="inherit"
          aria-label="Sign out"
          onMouseOver={() => setHoveredButton("SignOut")}
          onMouseOut={() => setHoveredButton("")}
          style={{ color: hoveredButton === "SignOut" && "blue" }}
          onClick={handleSignOut}
        >
          <Tooltip title="Sign Out" placement="bottom">
            <ExitToApp />
          </Tooltip>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}