import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

export const MemberHome = () => {
    const { logout, token } = useAuth();
    const [books, setBooks] = useState([]);
    const [borrowings, setBorrowings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooksAndBorrowings();
    }, []);

    const fetchBooksAndBorrowings = async () => {
        try {
            // Fetch books
            const booksRes = await axios.get(`${import.meta.env.VITE_GOLANG_API_URL}/books`, {
                headers: { Authorization: token },
            });
            const availableBooks = booksRes.data.books;
            setBooks(availableBooks);

            // Fetch borrowings
            const borrowingsRes = await axios.get(`${import.meta.env.VITE_GOLANG_API_URL}/my-borrowings`, {
                headers: { Authorization: token },
            });

            // Cross-check borrowings with available books
            const borrowingsWithDeletedStatus = borrowingsRes.data.map(borrowing => {
                const bookExists = availableBooks.some(book => book.ID === borrowing.BookID);
                return {
                    ...borrowing,
                    isBookDeleted: !bookExists,
                };
            });

            setBorrowings(borrowingsWithDeletedStatus);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBorrowBook = async (bookId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_GOLANG_API_URL}/borrow`,
                { book_id: bookId },
                { headers: { Authorization: token } }
            );
            fetchBooksAndBorrowings();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReturnBook = async (borrowingId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_GOLANG_API_URL}/return`,
                { borrowing_record_id: borrowingId },
                { headers: { Authorization: token } }
            );
            fetchBooksAndBorrowings();
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

    const filterBooks = (books, searchTerm) => {
        return books.filter(
            (book) =>
                book.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.Author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.Genre.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredBooks = filterBooks(books, searchTerm);

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
                <Box display="flex" justifyContent="center" mb={4}>
                    <TextField
                        label="Search Books"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        style={{ maxWidth: 800 }}
                    />
                </Box>
                {filteredBooks.length > 0 ?
                    (<TableContainer component={Paper} style={{ maxWidth: 800, margin: '0 auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Author</TableCell>
                                    <TableCell>Publication Date</TableCell>
                                    <TableCell>Genre</TableCell>
                                    <TableCell>Availability</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredBooks.map((book) => (
                                    <TableRow key={book.ID}>
                                        <TableCell>{book.ID}</TableCell>
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
                    </TableContainer>) : (
                        <Typography variant="body1" align="center">
                            No results found.
                        </Typography>
                    )}
            </Box>

            <Box mt={8}>
                <Typography variant="h5" align="center" mb={4}>
                    My Borrowings
                </Typography>
                {borrowings.length > 0 ? (
                    <TableContainer component={Paper} style={{ maxWidth: 800, margin: '0 auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Book ID</TableCell>
                                    <TableCell>Borrow Date</TableCell>
                                    <TableCell>Return Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {borrowings.map((borrowing) => (
                                    <TableRow key={borrowing.ID}>
                                        <TableCell>{borrowing.BookID}</TableCell>
                                        <TableCell>{formatDate(borrowing.BorrowDate)}</TableCell>
                                        <TableCell>
                                            {borrowing.ReturnDate === '0001-01-01T00:00:00Z' ? 'Not Returned' : formatDate(borrowing.ReturnDate)}
                                        </TableCell>
                                        <TableCell>
                                            {borrowing.isBookDeleted ? 'Book Deleted' : 'Available'}
                                        </TableCell>
                                        <TableCell>
                                            {borrowing.ReturnDate === '0001-01-01T00:00:00Z' && !borrowing.isBookDeleted && (
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
                ) : (
                    <Typography variant="body1" align="center">
                        You have no borrowing history.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
