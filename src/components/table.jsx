/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button, Stack } from '@mui/material'
import * as XLSX from 'xlsx'
// Add imports for PDF export
// Update these imports at the top of the file
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'


export default function ExcelTableView() {
  const [rows, setRows] = React.useState([])
  const [columns, setColumns] = React.useState([])

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (evt) => {
      const data = evt.target.result
      const workbook = XLSX.read(data, { type: 'binary' })

      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      // First get all the data including headers
      const allData = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      // The first row contains headers
      const headers = allData[0]
      console.log('Headers from Excel:', headers)

      // The rest are actual data rows - ENSURE we're skipping header row
      // Use slice(1) to exclude the first row (headers)
      const dataRows = allData.slice(1)
      console.log('Data rows before removing first element:', dataRows)

      // Force remove the first element which might be a header row
      if (dataRows.length > 0) {
        dataRows.shift() // This will remove the first element from the array
      }
      console.log('Data rows after removing first element:', dataRows)

      // Create column definitions that match exactly how sheet_to_json creates property names
      const columnDefs = headers.map((header) => ({
        field: header.toLowerCase().replace(/\s+/g, ''), // Convert to lowercase and remove spaces
        headerName: header,
        flex: 1,
        minWidth: 120
      }))

      // Add ID column
      columnDefs.unshift({
        field: 'id',
        headerName: 'ID',
        width: 70
      })

      // Convert data rows to objects with matching property names - exclude headers
      const newRows = dataRows.map((row, index) => {
        const obj = { id: index + 1 }
        headers.forEach((header, i) => {
          obj[header.toLowerCase().replace(/\s+/g, '')] = row[i]
        })
        return obj
      })

      console.log('Column definitions:', columnDefs)
      console.log('Rows with IDs:', newRows)

      setColumns(columnDefs)
      setRows(newRows)
    }

    reader.readAsBinaryString(file)
  }
  const handleExportExcel = () => {
    // Skip export if there's no data
    if (rows.length === 0) {
      alert('No data to export. Please upload an Excel file first.')
      return
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Convert rows to worksheet format
    // We need to remove the ID field that we added for DataGrid
    const worksheetData = rows.map(row => {
      const newRow = { ...row }
      delete newRow.id
      return newRow
    })

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'exported_data.xlsx')
  }

  const handleExportPDF = () => {
    if (rows.length === 0) {
      alert('No data to export. Please upload an Excel file first.')
      return
    }

    const doc = new jsPDF()

    const tableColumns = columns
      .filter(col => col.field !== 'id')
      .map(col => col.headerName)

    const tableRows = rows.map(row => {
      return columns
        .filter(col => col.field !== 'id')
        .map(col => row[col.field])
    })

    doc.text('Exported Data', 14, 15)

    // This should work with the latest version
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 20
    })

    doc.save('exported_data.pdf')
  }
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Bảng nhập kho từ Excel
      </Typography>

      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2 }}
      >
        Upload Excel
        <input
          type="file"
          accept=".xlsx, .xls"
          hidden
          onChange={handleFileUpload}
        />
      </Button>
      <Button
        sx={{ ml: 2, mb: 2 }}
        variant="contained"
        color="success"
        onClick={handleExportExcel}
        disabled={rows.length === 0}
      >
          Export Excel
      </Button>
      <Button
        sx={{ ml: 2, mb: 2 }}
        variant="contained"
        color="secondary"
        onClick={handleExportPDF}
        disabled={rows.length === 0}
      >
          Export PDF
      </Button>
      <Box sx={{ height: 600, width: '100%', bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  )
}