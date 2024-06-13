import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const LibrarianForm = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/admin/librarians/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user: {
                        email,
                        password,
                    },
                }),
            });
            if (response.ok) {
                setEmail('');
                setPassword('');
                onSuccess();
            } else {
                console.error('Error creating librarian');
            }
        } catch (error) {
            console.error('Error creating librarian:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" component="h2" gutterBottom>
                Create Librarian
            </Typography>
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Create
            </Button>
        </Box>
    );
};

export default LibrarianForm;