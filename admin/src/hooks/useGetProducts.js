import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getProducts } from '../api/http/products';

export const useGetProducts = (
	sort,
	direction,
	page,
	pageSize,
	searchTermValue
) => {
	return useQuery(
		['products', page, searchTermValue],
		() => getProducts(sort, direction, page, pageSize, searchTermValue),
		{
			select: (data) => {
				return data.data;
			},
			onError: (error) => {
				toast.error('Something went wrong');
			},
			keepPreviousData: true,
		}
	);
};
