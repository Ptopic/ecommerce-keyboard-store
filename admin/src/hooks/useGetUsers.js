import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getUsers } from '../api/http/users';

export const useGetUsers = (
	sort,
	direction,
	page,
	pageSize,
	searchTermValue
) => {
	return useQuery(
		['users', page, searchTermValue],
		() => getUsers(sort, direction, page, pageSize, searchTermValue),
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
