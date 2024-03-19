import { useQuery } from 'react-query';
import { getProductPrices } from '../api/http/products';
import { toast } from 'react-hot-toast';

export const useGetProductPrices = (category, activeFillters) => {
	return useQuery(
		['product', 'prices', category],
		getProductPrices(category, activeFillters),
		{
			onError: (error) => {
				toast.error('Something went wrong');
			},
		}
	);
};
