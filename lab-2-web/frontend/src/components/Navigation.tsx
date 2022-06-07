import { Box } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: '#F7F7F7'
      }}
    >
      <Container sx={{ width: 420, height: 40, display: 'flex', alignItems: 'center', 'a': { textDecoration: 'none', color: "#222222", ml: 4 } }}>
        <Link to="/">Main</Link>
        <Link to="about">About</Link>
      </Container>
    </Box>
  )
}

export default Navigation