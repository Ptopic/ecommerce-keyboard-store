import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getCategories } from '../api/http/categories';

export const useGetCategories = (
	sort,
	direction,
	page,
	pageSize,
	searchTermValue
) => {
	return useQuery(
		['categories', page, searchTermValue],
		() => getCategories(sort, direction, page, pageSize, searchTermValue),
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

export const useGetAllCategories = () => {
	return useQuery('categories', () => getCategories(), {
		select: (data) => {
			return data.data.data;
		},
		onError: (error) => {
			toast.error('Something went wrong');
		},
	});
};
