import { useQuery } from 'react-query';
import { getInitialProducts } from '../api/http/products';
import { toast } from 'react-hot-toast';

export const useGetInitialProducts = (category, sort, direction) => {
	return useQuery(
		['products', category],
		getInitialProducts(category, null, sort, direction),
		{
			select: (data) => {
				return data.data;
			},
			onError: (error) => {
				toast.error('Something went wrong');
			},
		}
	);
};
