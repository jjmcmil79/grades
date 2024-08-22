import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function ImportStudents() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      console.log('Workbook:', workbook);
      console.log('Sheet names:', workbook.SheetNames);
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      console.log('Worksheet:', worksheet);
  
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log('JSON Data:', jsonData);

      const formattedData = jsonData.map(student => ({
        first_name: student[0],
        last_name: student[1],
        email: student[3],
        phone_number: student[2],
        user_id: student[4]
      }));
      console.log('Formatted Data:', formattedData);
      try {
        await axios.post('http://localhost:3010/api/students/import', formattedData);
        console.log(formattedData)
        alert('Students imported successfully!');
      } catch (error) {
        console.error('Error importing students:', error);
        alert('Error importing students. Please try again.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv,.xlsx,.xls" />
      <button onClick={handleImport}>Import Students</button>
    </div>
  );
}

export default ImportStudents;