import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { generateFilters } from '../api/http/filters';

export const useGenerateFilters = (categoryName) => {
	return useQuery(
		['product-filters', categoryName],
		() => generateFilters(categoryName),
		{
			select: (data) => {
				return data;
			},
			onError: (error) => {
				toast.error('Something went wrong');
			},
		}
	);
};
