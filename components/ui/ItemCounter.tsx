import { FC } from 'react';

import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
  currentValue: number;
  maxValue: number;
  updatedQuantity: (quantity: number) => void;
}

export const ItemCounter:FC<Props> = ({ currentValue, maxValue, updatedQuantity }) => {

  const onUpdatedQuantity = ( addNumber: number ) => {
    const newQuantity = currentValue + addNumber;
    if( newQuantity >= maxValue || newQuantity <= 0 ) return;
    updatedQuantity(newQuantity);
  }

  return (
    <Box display='flex' alignItems='center'>
        <IconButton
          onClick={ () => onUpdatedQuantity(-1) }
        >
            <RemoveCircleOutline />
        </IconButton> 
        <Typography sx={{ width: 40, textAlign: 'center' }}> { currentValue } </Typography>
        <IconButton
          onClick={ () => onUpdatedQuantity(1)}
        >
            <AddCircleOutline />
        </IconButton> 
    </Box>
  )
}

