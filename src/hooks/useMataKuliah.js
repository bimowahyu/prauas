/* eslint-disable no-unused-vars */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMatkuls, addMatkul, updateMatkul, deleteMatkul } from '../api'; 

const limit = 5;

export const useMatkul = (page) => {
  const queryClient = useQueryClient();

  const {
    data: matkuls = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['matkuls', page, limit],
    queryFn: () => fetchMatkuls(page, limit).then(res => res.data),
    keepPreviousData: true
  });

  const addMutation = useMutation({
    mutationFn: addMatkul,
    onSuccess: () => queryClient.invalidateQueries(['matkuls']),
    onError: (error) => {
      alert(`Gagal menambahkan matkuls: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMatkul(id, data),
    onSuccess: () => queryClient.invalidateQueries(['matkuls']),
    onError: (error) => {
      alert(`Gagal mengupdate matkuls: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMatkul,
    onSuccess: () => queryClient.invalidateQueries(['matkuls']),
    onError: (error) => {
      alert(`Gagal menghapus matkuls: ${error.message}`);
    }
  });

  return {
    matkuls,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit,
  };
};
