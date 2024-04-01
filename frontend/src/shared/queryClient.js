import { QueryClient } from 'react-query';

export const queryClientDefaultOptions = {
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			retry: false,
			refetchOnWindowFocus: false,
			retryDelay: 1000,
		},
		mutations: {
			retry: false,
		},
	},
};

export const getQueryClient = new QueryClient({
	...queryClientDefaultOptions,
});
