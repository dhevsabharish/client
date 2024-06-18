import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowModes, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useAuth } from "../hooks/useAuth";
import AddBookForm from './AddBookForm';
import BorrowingRecords from './BorrowingRecords';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const LibrarianDashboard = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const { token } = useAuth();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchBooks();
  }, [forceUpdate]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_GOLANG_API_URL}/books`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.books && Array.isArray(data.books)) {
        const formattedBooks = data.books.map((book) => ({
          ...book,
          PublicationDate: formatDate(book.PublicationDate),
        }));
        setRows(formattedBooks);
      } else {
        console.error('Invalid response data:', data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setSnackbar({ open: true, message: 'Error fetching books', severity: 'error' });
    }
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === 'rowFocusOut') {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = async (id) => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View },
    }));
    const editedRow = rows.find((row) => row.ID === id);
    try {
      await updateBook(editedRow, token);
      setForceUpdate((prev) => !prev); // Force re-fetch to get updated data
    } catch (error) {
      console.error('Error saving book:', error);
      setSnackbar({ open: true, message: 'Error saving book', severity: 'error' });
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteBook(id, token);
      setRows((prevRows) => prevRows.filter((row) => row.ID !== id));
      setForceUpdate((prev) => !prev); // Toggle the dummy state to force re-render
    } catch (error) {
      console.error('Error deleting book:', error);
      setSnackbar({ open: true, message: 'Error deleting book', severity: 'error' });
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));

    const editedRow = rows.find((row) => row.ID === id);
    if (editedRow.isNew) {
      setRows((prevRows) => prevRows.filter((row) => row.ID !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleProcessRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, PublicationDate: formatDate(newRow.PublicationDate) };
    try {
      await updateBook(updatedRow, token);
      setForceUpdate((prev) => !prev); // Force re-fetch to get updated data
      return updatedRow;
    } catch (error) {
      console.error('Error updating book:', error);
      setSnackbar({ open: true, message: 'Error updating book: ' + error.message, severity: 'error' });
      return newRow;
    }
  };

  const columns = [
    { field: 'ID', headerName: 'ID', flex: 1, editable: true },
    { field: 'Title', headerName: 'Title', flex: 1, editable: true },
    { field: 'Author', headerName: 'Author', flex: 1, editable: true },
    { field: 'PublicationDate', headerName: 'Publication Date', flex: 1, editable: true },
    { field: 'Genre', headerName: 'Genre', flex: 1, editable: true },
    { field: 'Availability', headerName: 'Availability', type: 'number', flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={() => handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleBookAdded = (newBook) => {
    try {
      setRows((prevRows) => [...prevRows, newBook]);
    } catch (error) {
      console.error('Error updating books:', error);
      setSnackbar({ open: true, message: 'Error adding book', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <AddBookForm token={token} onBookAdded={handleBookAdded} />
      <DataGrid
        columns={columns}
        rows={rows}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={handleProcessRowUpdate}
        getRowId={(row) => row.ID} // Ensure consistency with row ID key
      />
      <BorrowingRecords />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const updateBook = async (book, token) => {
  console.log('Book data being sent:', book);
  const bookToUpdate = {
    title: book.Title,
    author: book.Author,
    genre: book.Genre,
    publication_date: formatDate(book.PublicationDate),
    availability: book.Availability,
  };
  const response = await fetch(`${import.meta.env.VITE_GOLANG_API_URL}/books/${book.ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(bookToUpdate),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update book');
  }

  return await response.json();
};


const deleteBook = async (id, token) => {
  const response = await fetch(`${import.meta.env.VITE_GOLANG_API_URL}/books/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete book');
  }
};

export default LibrarianDashboard;
