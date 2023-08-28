import { useCallback, useEffect, useState } from 'react';

const localCellPath = 'http://localhost:3000/cells.json';
const localUserPath = 'http://localhost:3000/user.json';

const fetchData = async path => {
  const response = await fetch(path);
  return await response.json();
};

export function useFetchCellData({ cellEndpoint }) {
  const fetchCallback = useCallback(fetchData, []);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchCellData = async () => {
      try {
        const [cellData, userData] = await Promise.all([fetchCallback(localCellPath), fetchCallback(localUserPath)]);
        let temp = cellData?.find(cells => cells.endpoint === cellEndpoint);

        temp = { ...temp, team: userData?.filter(user => user.cellId === temp.id) };

        if (!ignore) {
          setData(temp);
          setIsLoading(false);
        }
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    };

    fetchCellData();

    return () => {
      ignore = true;
    };
  }, []);

  return { data, isLoading, error };
}

export function useFetchCells() {
  const fetchCallback = useCallback(fetchData, []);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    try {
      const fetchCells = async () => {
        const cells = await fetchCallback(localCellPath);

        if (!ignore) {
          setData(cells);
          setIsLoading(false);
        }
      };

      fetchCells();
    } catch (e) {
      setError(e);
      setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, []);

  return [data, isLoading, error];
}
