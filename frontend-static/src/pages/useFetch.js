import React, { useState, useEffect } from 'react';

function useFetch(filePath) {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch(filePath);
				const jsonData = await response.json();
				setData(jsonData);
				setIsLoading(false);
			} catch (err)	{
				setError(err);
				setIsLoading(false);
			}
		}

		fetchData();
	}, [filePath]);
	
	return { data, isLoading, error };

}

export default useFetch;