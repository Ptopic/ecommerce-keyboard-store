import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getProductById } from '../api/http/products';

export const useGetProductById = (id) => {
	return useQuery(['product-admin', id], () => getProductById(id), {
		select: (data) => {
			return data.data.data;
		},
		onError: (error) => {
			toast.error('Something went wrong');
		},
	});
};
