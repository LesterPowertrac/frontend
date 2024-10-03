import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { Box, Container } from '@mui/material';

const DefaultLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar starts expanded

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
<Box sx={{ display: 'flex', minHeight: '100vh' }}>
  {/* Sidebar */}
  <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

  {/* Main Content Area */}
  <Box
    sx={{
      flexGrow: 1,
      width: isSidebarOpen ? 'calc(100% - 240px)' : 'calc(100% - 80px)', // Adjust width dynamically based on the sidebar
      transition: 'width 0.3s ease', // Smooth transition when toggling sidebar
    }}
  >
    {/* Topbar */}
    <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    {/* Content Container */}
    <Container maxWidth="lg" sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
      <Outlet />
    </Container>
  </Box>
</Box>
  );
};

export default DefaultLayout;
