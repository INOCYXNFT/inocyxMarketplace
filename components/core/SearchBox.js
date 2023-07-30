import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Search } from '@mui/icons-material';

export default function SearchBox({ onChange }) {

  return (
    <TextField
      sx={{
        '& legend': { display: 'none' },
        '& fieldset': { top: 0 },
      }}
      inputProps={{ style: { height: "100%" } }}
      InputLabelProps={{ shrink: false }}
      id="search-box"
      label="Search"
      className='w-full h-[100%] col-span-3 '
      InputProps={{ endAdornment: <Search /> }}
      onChange={(e) => onChange('search', e.target.value)}
      variant="outlined"
    />
  );
}