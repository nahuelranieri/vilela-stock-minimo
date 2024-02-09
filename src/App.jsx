import { useState, useEffect, useMemo } from 'react'
import './App.css'
import { postApi, getApi } from './hooks/api';
import datita from './MOCK_DATA.json'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { FileDownload, PictureAsPdf, Refresh } from '@mui/icons-material';
import { Box, Button } from '@mui/material';


function App() {

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [editedCell, setEditedCell] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getApi();
        setApiData(data);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      } finally {
        setLoading(false);
      }
    };
    
      fetchData();
      setRefreshData(false);
    
  }, [refreshData]);

  const columns = useMemo(
    () => [
      {
        header: 'SKU Ref',
        accessorKey: 'sku_ref',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
        enableEditing: false,
      },
      {
        header: 'Stock',
        accessorKey: 'stock',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
        enableEditing: false,
      },
      {
        header: 'Stock Min',
        accessorKey: 'stock_min',
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        muiEditTextFieldProps: ({cell,row}) => ({
          error: !!validationErrors.stock_min, //highlight mui text field red error color
          helperText: validationErrors.stock_min, //show error message in helper text.
          required: true,
          type: 'number',
          onChange: (event)=> {
            let newValue = event.currentTarget.value;
            if (newValue === "") {
              newValue = "0"; 
            }
            event.currentTarget.value = newValue;
            console.log("Nuevo valor:", newValue);
          },
        }),
      },
      {
        header: 'Disponible',
        accessorFn: (row) => (
          console.log(table.getColumn("stock")),
          Math.max((row.stock) - (row.stock_min), 0)),
        filterVariant: 'multi-select',
        enableColumnFilterModes: false,
        enableEditing: false,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: datita,
    initialState: { showColumnFilters: false, density: 'compact' },
    enableRowSelection: true,
    enableFacetedValues: true,
    enableColumnFilterModes: true,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnResizing: true,
    positionToolbarAlertBanner: 'bottom',
    enableEditing: true,
    editDisplayMode: 'cell',
    onEditingRowCancel: () => setValidationErrors({}),
    state: {
      showSkeletons: loading,
      rowSelection 
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          startIcon={<Refresh />}
          onClick={()=> {setRefreshData(true)}}
        >
          Refresh
        </Button>
      </Box>
    )
  });

  return (
    <>
      <MaterialReactTable
        table={table}
      />
    </>
  )
}

export default App
