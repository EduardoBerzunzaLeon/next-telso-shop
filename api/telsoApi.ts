
import axios from 'axios';

const telsoApi =  axios.create({
    baseURL: '/api'
});

export default telsoApi;