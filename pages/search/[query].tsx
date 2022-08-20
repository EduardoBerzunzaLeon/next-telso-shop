import type { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';

import { ProductList } from '../../components/products';
import { ShopLayout } from '../../components/layouts';

import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';


interface Props {
  products: IProduct[];
  hasProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, hasProducts, query }) => {

  return (
    <ShopLayout title='Telso-shop - SearchPage' pageDescription='Encuentra los mejores productos de Telso aqui'>
      <Typography variant='h1' component='h1'>Buscar Producto</Typography>
      {
        hasProducts
          ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Término: { query }</Typography>
          : (
            <Box display='flex'>
              <Typography variant='h2' sx={{ mb: 1 }}>No encontramos ningún producto de: </Typography>
              <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize'>{ query }</Typography>
            </Box>
          )
      }
      <ProductList products={ products } />
   </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
  const { query = '' }  = params as { query: string };

  if( query.length === 0 ) {
    return { 
      redirect: {
        destination: '/',
        permanent: true,
      }
    }
  }

  let products = await dbProducts.getProductByTerm( query );
  const hasProducts = products.length > 0;

  if( !hasProducts ) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      hasProducts,
      query
    }
  }
}

export default SearchPage;
