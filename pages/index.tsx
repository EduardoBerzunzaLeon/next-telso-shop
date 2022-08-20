import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { FullScreenLoading } from '../components/ui/';
import { ProductList } from '../components/products';
import { ShopLayout } from '../components/layouts';

import { useProducts } from '../hooks/useProducts';

const HomePage: NextPage = () => {

 const { products, isError, isLoading } = useProducts('/products');

  return (
   <ShopLayout title='Telso-shop - HomePage' pageDescription='Encuentra los mejores productos de Telso aqui'>
    <Typography variant='h1' component='h1'>Tienda</Typography>
    <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

    {
     isLoading
        ? <FullScreenLoading /> 
        : (<ProductList 
          products={ products } 
        />)
    }
    

   </ShopLayout>
  )
}

export default HomePage;
