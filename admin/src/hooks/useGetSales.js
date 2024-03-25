import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getSales } from '../api/http/sales';

export const useGetSales = () => {
	return useQuery('sales-stats', () => getSales(), {
		select: (data) => {
			return data.data.data;
		},
		onError: (error) => {
			toast.error('Something went wrong');
		},
	});
};
