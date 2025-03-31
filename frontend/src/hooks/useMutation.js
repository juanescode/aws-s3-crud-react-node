import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import axiosClient from '../config/axios';

const useMutation = ({ url, method = 'POST', successMessage }) => {
  const toast = useToast();
  const [state, setState] = useState({
    isLoading: false,
    error: '',
  });

  const fn = async data => {
    setState(prev => ({
      ...prev,
      isLoading: true,
    }));
  
    let requestConfig = { method, url };
  
    if (method === 'POST' || method === 'PUT') {
      requestConfig.data = data;
    }
  

    if (method === 'DELETE' && data?.key) {
      requestConfig.url = `${url}/${data.key}`;
    }
  
    try {
      const response = await axiosClient(requestConfig);
      console.log('Respuesta del servidor:', response);
      
      setState({ isLoading: false, error: '' });
      toast({
        title: successMessage || 'Success!',
        status: 'success',
        duration: 2000,
        position: 'top',
      });
      
      return response.data;
    } catch (error) {
      console.error('Error completo:', error);
      setState({ isLoading: false, error: error.message });
      throw error;
    }
  };

  return { mutate: fn, ...state };
};

export default useMutation;
