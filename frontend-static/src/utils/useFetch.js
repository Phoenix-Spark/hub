import { useCallback, useEffect, useState } from 'react';

const url = `${window.location.origin}/hub/json/`;
const localCellPath = `${url}cells.json`;
const localUserPath = `${url}users.json`;
const localFaqsPath = `${url}faqs.json`;
const localBasesPath = `${url}bases.json`;

const fetchData = async path => {
  console.log(window.location);
  const response = await fetch(path);
  return await response.json();
};

export function useFetchCellData(cellEndpoint) {
  const fetchCallback = useCallback(fetchData, []);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchCellData = async () => {
      try {
        const [cellData, userData, baseData] = await Promise.all([
          fetchCallback(localCellPath),
          fetchCallback(localUserPath),
          fetchCallback(localBasesPath),
        ]);
        let temp = cellData?.find(cells => cells.endpoint === cellEndpoint);

        temp = { ...temp, team: userData?.filter(user => user.cell_id === temp.id) };

        temp.base = baseData.find(base => base.id === temp.base_id);

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

  return [data, isLoading, error];
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
        const [cellData, baseData] = await Promise.all([fetchCallback(localCellPath), fetchCallback(localBasesPath)]);

        cellData.forEach(cell => (cell.base = baseData.find(base => base.id === cell.base_id)));

        if (!ignore) {
          setData(cellData);
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

export function useFetchUser(profileModal) {
  const fetchCallback = useCallback(fetchData, []);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('new profile id');
    let ignore = false;
    try {
      const fetchUserData = async () => {
        const [userData, cellData] = await Promise.all([fetchCallback(localUserPath), fetchCallback(localCellPath)]);

        let temp = userData.find(user => user.id === profileModal.userId);

        temp.cell = cellData.find(cell => cell.id === temp.cell_id);

        if (!ignore) {
          setData(temp);
          setIsLoading(false);
        }
      };

      if (profileModal.userId !== 0) fetchUserData();
    } catch (e) {
      console.error(e);
      setError(e);
      setIsLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [profileModal]);

  return [data, isLoading, error];
}
