import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess'; // Import ExpandLess for up arrow
import ExpandMore from '@mui/icons-material/ExpandMore'; // Import ExpandMore for down arrow
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useNavigate } from 'react-router-dom'; 
import Logo from '../assets/Logo';
import { useState } from 'react';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })( 
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: { open: true },
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: { open: false },
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleDropdownToggle = () => {
    setOpenDropdown((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/Monitoring"); }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
              <ListItemText
                primary={<Logo />}
                sx={{ textAlign: 'center', opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          <IconButton onClick={() => setOpen(!open)}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Other List Items */}
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/monitoring"); }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Monitoring" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/Pending"); }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Pending" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* Main List Item for Incentives */}
          <ListItem disablePadding  sx={{ display: 'block' }}>
            <ListItemButton onClick={handleDropdownToggle} sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Incentives" sx={{ opacity: open ? 1 : 0 }}/>
              {openDropdown ? <ExpandLess /> : <ExpandMore />} {/* Toggle arrow icon */}
            </ListItemButton>
          </ListItem>

          {/* Nested List */}
          <Collapse in={openDropdown} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton  onClick={() => navigate('/incentive_technician')}>
                <ListItemText primary="Incentive Technician" sx={{ pl: 4,opacity: open ? 1 : 0  }}/>
              </ListItemButton>
              <ListItemButton  onClick={() => navigate('/incentive_advisor')}>
                <ListItemText primary="Incentive Advisor" sx={{ pl: 4,opacity: open ? 1 : 0  }} />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => { navigate("/Dispatching"); }}>
            <ListItemButton sx={{ minHeight: 48, px: 2.5, justifyContent: open ? 'initial' : 'center' }}>
              <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', mr: open ? 3 : 'auto' }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Dispatching" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
