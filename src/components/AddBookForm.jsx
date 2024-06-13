import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAuth } from "../hooks/useAuth";

const AddBookForm = ({ onBookAdded }) => {
    const [formData, setFormData] = useState({
        title: 'some title',
        author: 'some author',
        publication_date: '2020-11-11',
        genre: 'some genre',
        availability: 20,
    });
    const { token } = useAuth();

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newBook = await addBook(formData, token);
            onBookAdded(newBook); // Call the onBookAdded prop with the new book data
            setFormData({
                title: '',
                author: '',
                publication_date: '',
                genre: '',
                availability: 0,
            });
            window.location.reload(); // Reload the page after adding the book
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };


    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
            <Typography variant="h6">Add Book</Typography>
            <TextField
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <TextField
                name="author"
                label="Author"
                value={formData.author}
                onChange={handleChange}
                required
            />
            <TextField
                name="publication_date"
                label="Publication Date"
                value={formData.publication_date}
                onChange={handleChange}
                required
            />
            <TextField
                name="genre"
                label="Genre"
                value={formData.genre}
                onChange={handleChange}
                required
            />
            <TextField
                name="availability"
                label="Availability"
                type="number"
                value={formData.availability}
                onChange={handleChange}
                required
            />

            <Button type="submit" variant="contained">
                Add Book
            </Button>
        </Box>
    );
};

const addBook = async (bookData, token) => {
    const response = await fetch(`${import.meta.env.VITE_GOLANG_API_URL}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify(bookData),
    });
    const data = await response.json();
    return data.book; // Return the newly added book data
};

export default AddBookForm;
