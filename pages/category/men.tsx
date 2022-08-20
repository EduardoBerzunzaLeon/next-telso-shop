import { Typography } from '@mui/material';

import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const MenPage = () => {
    const { products, isError, isLoading } = useProducts('/products?gender=men');

    return (
     <ShopLayout title='Telso-shop - Kids' pageDescription='Encuentra los mejores productos de Telso para ellos'>
      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para ellos</Typography>
  
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

export default MenPage