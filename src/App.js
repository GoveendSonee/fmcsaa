import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import TextField from '@mui/material/TextField';
import { TailSpin } from 'react-loader-spinner';
import './App.css';
import PivotTableComponent from './PivotTableComponent';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'legal_name', headerName: 'Legal Name', width: 200 },
  { field: 'dba_name', headerName: 'DBA Name', width: 200 },
  { field: 'physical_address', headerName: 'Physical Address', width: 300 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'operating_status', headerName: 'Operating Status', width: 150 },
  { field: 'created_dt', headerName: 'Created Date', width: 150 },
  { field: 'data_source_modified_dt', headerName: 'Data Source Modified Date', width: 200 },
  { field: 'power_units', headerName: 'Power Units', width: 150 },
  { field: 'out_of_service_date', headerName: 'Out of Service Date', width: 200 },
  { field: 'state_carrier_id_number', headerName: 'State Carrier ID Number', width: 200 },
  { field: 'entity_type', headerName: 'Entity Type', width: 150 },
  { field: 'p_street', headerName: 'Physical Street Address', width: 200 },
  { field: 'p_city', headerName: 'Physical City', width: 150 },
  { field: 'p_state', headerName: 'Physical State', width: 150 },
  { field: 'p_zip_code', headerName: 'Physical ZIP Code', width: 150 },
  { field: 'mailing_address', headerName: 'Mailing Address', width: 300 },
  { field: 'm_street', headerName: 'Mailing Street Address', width: 200 },
  { field: 'm_city', headerName: 'Mailing City', width: 150 },
  { field: 'm_state', headerName: 'Mailing State', width: 150 },
  { field: 'm_zip_code', headerName: 'Mailing ZIP Code', width: 150 },
  { field: 'mc_mx_ff_number', headerName: 'MC/MX/FF Number', width: 150 },
  { field: 'mcs_150_form_date', headerName: 'MCS-150 Form Date', width: 150 },
  { field: 'duns_number', headerName: 'D-U-N-S Number', width: 150 },
  { field: 'drivers', headerName: 'Drivers', width: 150 },
  { field: 'mcs_150_mileage_year', headerName: 'MCS-150 Mileage Year', width: 150 },
  { field: 'credit_score', headerName: 'Credit Score', width: 150 },
  { field: 'record_status', headerName: 'Record Status', width: 150 },
];

export default function App() {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [filteredRows, setFilteredRows] = React.useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = json[0];
        const rows = json.slice(1).map((row) => {
          return headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {});
        });

        setRows(rows);
        setFilteredRows(rows);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    const searchTextLower = event.target.value.toLowerCase();
    const filtered = rows.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTextLower)
      );
    });
    setFilteredRows(filtered);
  };

  return (
    <div className='fmcsa_red'>
      <div className='title_Maino'>
        <h1 align='center'>FMCSA Viewer</h1>
        <p align='center'>Upload and View FMCSA Excel Official Data</p>
      </div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search..."
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: '1rem' }}
      />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <TailSpin height="80" width="80" color="gray" ariaLabel="loading" />
        </div>
      ) : (
        <>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20]}
            sx={{
              '& .MuiDataGrid-cell': {
                borderRight: '1px solid #ccc',
              },
              '& .MuiDataGrid-columnHeaders': {
                borderBottom: '2px solid #ccc',
              },
            }}
          />
           <div className='title_Maino' style={{ marginTop: "1rem", padding: "1rem", fontSize: "1.52rem", border: "5px solid #fff" }}>
            <p align='center'>View Pivot Table By Drag and Drop</p>
          </div>
          <PivotTableComponent data={filteredRows} />
        </>
      )}
    </div>
  );
}

