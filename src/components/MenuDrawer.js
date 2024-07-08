import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { MenuButton } from './StyledComponents';

const MenuDrawer = ({ isOpen, toggleDrawer, onMenuClick }) => {
  const handleMenuClick = (page) => {
    if (typeof onMenuClick === 'function') {
      onMenuClick(page);
    }
  };

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItemButton onClick={() => handleMenuClick('survey')}>
          <ListItemText primary="Survey Form" />
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuClick('upload')}>
          <ListItemText primary="Excel Uploader" />
        </ListItemButton>
      </List>
      <Button onClick={() => toggleDrawer(false)}>Cerrar Menú</Button> {/* Botón para cerrar el menú */}
    </Box>
  );

  return (
    <Drawer anchor="left" open={isOpen} onClose={() => toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
};

export const MenuButtonWrapper = ({ toggleDrawer }) => (
  <MenuButton onClick={() => toggleDrawer(true)}>☰</MenuButton>
);

export default MenuDrawer;
