import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowModes, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { useAuth } from "../hooks/useAuth";
import AddBookForm from './AddBookForm';

export const LibrarianDashboard = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const { token } = useAuth();
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [forceUpdate]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3003/books', {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.books && Array.isArray(data.books)) {
        setRows(data.books);
      } else {
        console.error('Invalid response data:', data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
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
      if (editedRow.isNew) {
        // wont reach here i think
      } else {
        await updateBook(editedRow, token);
        setForceUpdate((prev) => !prev); // Force re-fetch to get updated data
      }
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteBook(id, token);
      setRows((prevRows) => prevRows.filter((row) => row.ID !== id));
      setForceUpdate((prev) => !prev); // Toggle the dummy state to force re-render
    } catch (error) {
      console.error('Error deleting book:', error);
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
    if (newRow.isNew) {
      // wont reach here i think
    } else {
      try {
        await updateBook(newRow, token);
        setForceUpdate((prev) => !prev); // Force re-fetch to get updated data
        return newRow;
      } catch (error) {
        console.error('Error updating book:', error);
        return newRow;
      }
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
    }
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
        slots={{
          // toolbar: EditToolbar,
        }}
        slotProps={{
          // toolbar: { setRows, setRowModesModel },
        }}
        getRowId={(row) => row.ID} // Ensure consistency with row ID key
      />

    </Box>
  );
};

const updateBook = async (book, token) => {
  console.log('Book data being sent:', book);
  const response = await fetch(`http://localhost:3003/books/${book.ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(book),
  });
  return await response.json();
};

const deleteBook = async (id, token) => {
  await fetch(`http://localhost:3003/books/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token,
    },
  });
};

export default LibrarianDashboard;
