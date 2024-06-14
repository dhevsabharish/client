import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";
import {
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const LibrarianList = () => {
    const { token } = useAuth();
    const [librarians, setLibrarians] = useState([]);
    const [newLibrarian, setNewLibrarian] = useState({ email: '', password: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLibrarian, setSelectedLibrarian] = useState(null);

    useEffect(() => {
        fetchLibrarians();
    }, []);

    const fetchLibrarians = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_RAILS_API_URL}/admin/librarians/`, {
                headers: {
                    Authorization: token,
                },
            });
            const responseData = await response.json();
            const data = responseData.data;
            console.log(data);
            setLibrarians(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching librarians:', error);
        }
    };

    const handleCreateLibrarian = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_RAILS_API_URL}/admin/librarians/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ user: newLibrarian }),
            });
            if (response.ok) {
                setNewLibrarian({ email: '', password: '' });
                fetchLibrarians();
            } else {
                alert('Error creating librarian');
                console.error('Error creating librarian:', response.status);
            }
        } catch (error) {
            console.error('Error creating librarian:', error);
        }
    };

    const handleDeleteLibrarian = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_RAILS_API_URL}/admin/librarians/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: token,
                },
            });
            if (response.ok) {
                fetchLibrarians();
            } else {
                console.error('Error deleting librarian:', response.status);
            }
        } catch (error) {
            console.error('Error deleting librarian:', error);
        }
    };

    const handleOpenDialog = (librarian) => {
        setSelectedLibrarian(librarian);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedLibrarian(null);
    };

    const handleConfirmDelete = () => {
        handleDeleteLibrarian(selectedLibrarian.id);
        handleCloseDialog();
    };

    return (
        <Box p={3}>
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={5}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={newLibrarian.email}
                        onChange={(e) => setNewLibrarian({ ...newLibrarian, email: e.target.value })}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={5}>
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={newLibrarian.password}
                        onChange={(e) => setNewLibrarian({ ...newLibrarian, password: e.target.value })}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={2} display="flex" alignItems="center">
                    <Button variant="contained" onClick={handleCreateLibrarian} fullWidth>
                        Create Librarian
                    </Button>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(librarians) && librarians.map((librarian) => (
                            <TableRow key={librarian.id}>
                                <TableCell>{librarian.email}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(librarian)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Delete Librarian</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the librarian with email {selectedLibrarian?.email}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LibrarianList;
