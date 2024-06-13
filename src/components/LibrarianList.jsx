import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const LibrarianList = () => {
  const [librarians, setLibrarians] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchLibrarians();
  }, []);

  const fetchLibrarians = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/librarians/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLibrarians(data);
    } catch (error) {
      console.error('Error fetching librarians:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/admin/librarians/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLibrarians();
    } catch (error) {
      console.error('Error deleting librarian:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Librarians
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {librarians.map((librarian) => (
              <TableRow key={librarian.id}>
                <TableCell>{librarian.user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(librarian.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LibrarianList;