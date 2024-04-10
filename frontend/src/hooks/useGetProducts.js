import { useInfiniteQuery, useQuery } from 'react-query';
import { getAllProducts, getProducts } from '../api/http/products';
import { toast } from 'react-hot-toast';

export const useGetAllProducts = (
	pageParam,
	sort,
	direction,
	priceSliderValues
) => {
	return useInfiniteQuery(
		['products', pageParam],
		({ pageParam }) =>
			getAllProducts(pageParam, sort, direction, priceSliderValues),
		{
			initialPageParam: 0,
			getNextPageParam: (lastPage, allPages) => {
				console.log(allPages);
				return allPages.length + 1;
			},
			onError: (error) => {
				toast.error(`Failed to load products: ${error.message}`);
			},
			refetchOnWindowFocus: false,
		}
	);
};
