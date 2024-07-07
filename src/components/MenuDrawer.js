import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { MenuButton } from './StyledComponents';

const MenuDrawer = ({ isOpen, toggleDrawer }) => {
  const toggleDrawerHandler = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    toggleDrawer(anchor, open);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawerHandler(anchor, false)}
      onKeyDown={toggleDrawerHandler(anchor, false)}
    >
      <List>
        {['Home', 'Events', 'Browse Library', 'Messages', 'Community Feed'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={toggleDrawerHandler('left', false)}
    >
      {list('left')}
    </Drawer>
  );
};

export const MenuButtonWrapper = ({ toggleDrawer }) => (
  <MenuButton onClick={toggleDrawer('left', true)}>☰</MenuButton>
);

export default MenuDrawer;
