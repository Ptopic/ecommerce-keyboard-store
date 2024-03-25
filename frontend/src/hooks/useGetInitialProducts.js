import { useInfiniteQuery, useQuery } from 'react-query';
import { getInitialProducts } from '../api/http/products';
import { toast } from 'react-hot-toast';

export const useGetInitialProducts = (category, sort, direction) => {
	return useInfiniteQuery(
		['products', category],
		({ pageParam = 0 }) =>
			getInitialProducts(pageParam, category, sort, direction),
		{
			getNextPageParam: (lastPage, allPages) => {
				// console.log(allPages[0].data.totalPages);
				// console.log(allPages.length + 1);

				console.log(allPages.length + 1);

				if (allPages.length + 1 <= allPages[0].data.totalPages + 1) {
					return allPages.length + 1;
				} else {
					return undefined;
				}
			},
		}
	);
};
