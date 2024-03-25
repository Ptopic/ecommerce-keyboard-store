import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getLatestOrders } from '../api/http/orders';

export const useGetLatestOrders = () => {
	return useQuery('orders-latest', () => getLatestOrders(), {
		select: (data) => {
			return data.data.data;
		},
		onError: (error) => {
			toast.error('Something went wrong');
		},
	});
};
