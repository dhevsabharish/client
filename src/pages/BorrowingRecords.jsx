import React, { useState, useEffect } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const BorrowingRecords = () => {
    const [records, setRecords] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        fetchBorrowingRecords();
    }, []);

    const fetchBorrowingRecords = async () => {
        try {
            const res = await axios.get('http://localhost:3003/borrowing-records', {
                headers: { Authorization: token },
            });
            setRecords(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box mt={4}>
            <Typography variant="h5" align="center" mb={2}>
                Borrowing Records
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Book ID</TableCell>
                            <TableCell>Member ID</TableCell>
                            <TableCell>Borrow Date</TableCell>
                            <TableCell>Return Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.ID}>
                                <TableCell>{record.BookID}</TableCell>
                                <TableCell>{record.MemberID}</TableCell>
                                <TableCell>{record.BorrowDate}</TableCell>
                                <TableCell>{record.ReturnDate === '0001-01-01T00:00:00Z' ? 'Not Returned' : record.ReturnDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default BorrowingRecords;