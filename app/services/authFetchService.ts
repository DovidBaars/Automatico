'use server';

import { getUserToken } from './authService';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions extends RequestInit {
	method?: HttpMethod;
	body?: BodyInit;
	params?: Record<string, string>;
	pathParams?: Record<string, string>;
}

function addQueryParams(url: string, params: Record<string, string>): string {
	const searchParams = new URLSearchParams(params);
	return `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
}

function replacePathParams(
	url: string,
	pathParams: Record<string, string>
): string {
	return url.replace(/:([a-zA-Z]+)/g, (match, param) => {
		if (param in pathParams) {
			return encodeURIComponent(pathParams[param]);
		}
		return match;
	});
}

async function authFetch(
	url: string,
	options: FetchOptions = {}
): Promise<Response> {
	const token = await getUserToken();

	const defaultHeaders = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	let fetchUrl = url;
	if (options.pathParams) {
		fetchUrl = replacePathParams(fetchUrl, options.pathParams);
	}
	if (options.params) {
		fetchUrl = addQueryParams(fetchUrl, options.params);
	}

	const fetchOptions: RequestInit = {
		...options,
		headers: {
			...defaultHeaders,
			...(options.headers || {}),
		},
	};

	if (options.body && typeof options.body === 'object') {
		fetchOptions.body = JSON.stringify(options.body);
	}

	try {
		const response = await fetch(fetchUrl, fetchOptions);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error('Fetch error:', error);
		throw error;
	}
}

export const authGet = async (
	url: string,
	options?: Omit<FetchOptions, 'method' | 'body'>
) => await authFetch(url, { ...options, method: 'GET' });

export const authPost = async (
	url: string,
	body: FetchOptions['body'],
	options?: Omit<FetchOptions, 'method' | 'body'>
) => await authFetch(url, { ...options, method: 'POST', body });

export const authPut = async (
	url: string,
	body: FetchOptions['body'],
	options?: Omit<FetchOptions, 'method' | 'body'>
) => await authFetch(url, { ...options, method: 'PUT', body });

export const authDelete = async (
	url: string,
	options?: Omit<FetchOptions, 'method' | 'body'>
) => await authFetch(url, { ...options, method: 'DELETE' });

export const authPatch = async (
	url: string,
	body: FetchOptions['body'],
	options?: Omit<FetchOptions, 'method' | 'body'>
) => await authFetch(url, { ...options, method: 'PATCH', body });
