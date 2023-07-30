import * as React from 'react';
import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';

export default function Selector({ label, onChange, type, value, options, listOption, setListOption }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [formattedOptions, setFormattedOptions] = useState([])

  useEffect(() => {
    switch (label) {
      case 'Category':
        const categories = options.map(option => {
          let formatted = {
            name: option.categoryName,
            option_value: option.id
          }
          return formatted
        })
        setFormattedOptions(categories)
        break;
      case 'Type':
        const types = options.map(option => {
          let formatted = {
            name: option.name,
            option_value: option.value
          }
          return formatted
        })
        setFormattedOptions(types)
        break;
      case 'Status':
        const status = options.map(option => {
          let formatted = {
            name: option.name,
            option_value: option.value
          }
          return formatted
        })
        setFormattedOptions(status)
        break;
      case 'Filter':
        const filter = options.map(option => {
          let formatted = {
            name: option.name,
            option_value: option.value
          }
          return formatted
        })
        setFormattedOptions(filter)
        break;
    }
  }, [options, value])

  const PriceSort = [
    {
      id: 1,
      title: "All",
    },
    {
      id: 2,
      title: "Price: High to Low",
    },
    {
      id: 3,
      title: "Price: Low to High",
    },
  ];

  const ListSort = [
    {
      id: 1,
      title: "All",
    },
    {
      id: 2,
      title: "Buy Now",
    },
  ];

  const CategoryList = [
    {
      id: 1,
      title: "All",
    },
    {
      id: 2,
      title: "Inocyx",
    },
  ];

  const PropertyList = [
    {
      id: 1,
      title: "All",
    },
    {
      id: 2,
      title: "Land",
    },
    {
      id: 3,
      title: "Sports",
    },
    {
      id: 4,
      title: "Photography",
    },
    {
      id: 5,
      title: "Memes",
    },
    {
      id: 6,
      title: "Games",
    },
    {
      id: 7,
      title: "Collectibles",
    },
    {
      id: 8,
      title: "Antique",
    },
    {
      id: 9,
      title: "Under 18",
    },
    {
      id: 10,
      title: "Art",
    },
  ];

  const CreatorSort = [
    {
      id: 1,
      title: "Volume",
    },
    {
      id: 2,
      title: "Ratings",
    },
    {
      id: 2,
      title: "Popular",
    },
  ];

  function handleInputChange(event) {
    switch (label) {
      case "Category":
        onChange('category', event.target.value)
        break;
      case "Type":
        onChange('nftType', event.target.value)
        break;
      case "Status":
        onChange('status', event.target.value)
        break;
      case "Filter":
        onChange('filter', event.target.value)
        break;
    }
  }
  return (
    <Select
      labelId={label}
      id={label}
      value={value}
      sx={{
        '& legend': { display: 'none' },
        '& fieldset': { top: 0 },
      }}
      label={label}
      className='w-full overflow-hidden'
      onChange={handleInputChange}
    >
      {formattedOptions?.map(option => (
        <MenuItem value={option.option_value}>{option.name}</MenuItem>
      ))}
    </Select>
  );
}