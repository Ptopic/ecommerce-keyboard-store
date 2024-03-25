import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getOrdersStats } from '../api/http/orders';

export const useGetOrdersStats = () => {
	return useQuery('orders-stats', () => getOrdersStats(), {
		select: (data) => {
			return data.data.data;
		},
		onError: (error) => {
			toast.error('Something went wrong');
		},
	});
};
