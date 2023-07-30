import React from 'react';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  primaryBtn: {
    background: 'linear-gradient(95.12deg, #F4B45B 0%, #FAE269 98.62%)',
    boxShadow: '0px 1px 1px rgb(0 0 0 / 8%)',
    borderRadius: 6,
    padding: '8px 20px',
  },
}));

function PrimaryButton(props) {
  const classes = useStyles();
  const { title, icon, className } = props;
  return (
    <Button variant="contained" className={`${className} ${classes.primaryBtn}`} startIcon={icon}>
      {title}
    </Button>
  );
}

export default PrimaryButton;
