import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export const MemberHome = () => {
    const { logout, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [borrowings, setBorrowings] = useState([]);

    useEffect(() => {
        fetchBooks();
        fetchBorrowings();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await axios.get('http://localhost:3003/books', {
                headers: { Authorization: token },
            });
            setBooks(res.data.books);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBorrowings = async () => {
        try {
            const res = await axios.get('http://localhost:3003/my-borrowings', {
                headers: { Authorization: token },
            });
            setBorrowings(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBorrowBook = async (bookId) => {
        try {
            await axios.post(
                'http://localhost:3003/borrow',
                { book_id: bookId },
                { headers: { Authorization: token } }
            );
            fetchBooks();
            fetchBorrowings();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReturnBook = async (borrowingId) => {
        try {
            await axios.post(
                'http://localhost:3003/return',
                { borrowing_record_id: borrowingId },
                { headers: { Authorization: token } }
            );
            fetchBooks();
            fetchBorrowings();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <Typography variant="h4" component="h1">
                    Member Home
                </Typography>
                <Button onClick={handleLogout} variant="contained">
                    Logout
                </Button>
            </Box>

            <Box mt={8}>
                <Typography variant="h5" align="center" mb={4}>
                    Available Books
                </Typography>
                <TableContainer component={Paper} style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Publication Date</TableCell>
                                <TableCell>Genre</TableCell>
                                <TableCell>Availability</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.map((book) => (
                                <TableRow key={book.ID}>
                                    <TableCell>{book.Title}</TableCell>
                                    <TableCell>{book.Author}</TableCell>
                                    <TableCell>{formatDate(book.PublicationDate)}</TableCell>
                                    <TableCell>{book.Genre}</TableCell>
                                    <TableCell>{book.Availability}</TableCell>
                                    <TableCell>
                                        {book.Availability > 0 && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleBorrowBook(book.ID)}
                                            >
                                                Borrow
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box mt={8}>
                <Typography variant="h5" align="center" mb={4}>
                    My Borrowings
                </Typography>
                <TableContainer component={Paper} style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Book ID</TableCell>
                                <TableCell>Borrow Date</TableCell>
                                <TableCell>Return Date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {borrowings.map((borrowing) => (
                                <TableRow key={borrowing.ID}>
                                    <TableCell>{borrowing.BookID}</TableCell>
                                    <TableCell>{formatDate(borrowing.BorrowDate)}</TableCell>
                                    <TableCell>{borrowing.ReturnDate === '0001-01-01T00:00:00Z' ? 'Not Returned' : formatDate(borrowing.ReturnDate)}</TableCell>
                                    <TableCell>
                                        {borrowing.ReturnDate === '0001-01-01T00:00:00Z' && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleReturnBook(borrowing.ID)}
                                            >
                                                Return
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};