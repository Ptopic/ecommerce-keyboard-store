import { useQuery } from 'react-query';
import { getCategories } from '../api/http/categories';
import { toast } from 'react-hot-toast';

export const useGetCategories = () => {
	return useQuery('categories', getCategories, {
		select: (data) => {
			return data.data;
		},
		onError: (error) => {
			toast.error('Something went wrong');
		},
	});
};
