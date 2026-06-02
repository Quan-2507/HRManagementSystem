export const fetchApi = async (url: string, options: RequestInit = {}) => {
  const mergedOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, mergedOptions);
  
  if (response.status === 401) {
    // Session expired or unauthenticated
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Session expired');
  }

  return response;
};
