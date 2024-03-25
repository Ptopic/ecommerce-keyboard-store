import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import { getUsersStats } from '../api/http/users';

export const useGetUsersStats = () => {
	return useQuery('users-stats', () => getUsersStats(), {
		select: (data) => {
			return data.data.data;
		},
		onError: (error) => {
			toast.error('Something went wrong');
		},
	});
};
