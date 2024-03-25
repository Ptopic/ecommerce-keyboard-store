import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getOrders } from '../api/http/orders';

export const useGetOrders = (
	sort,
	direction,
	page,
	pageSize,
	searchTermValue
) => {
	return useQuery(
		['orders', page, searchTermValue],
		() => getOrders(sort, direction, page, pageSize, searchTermValue),
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
