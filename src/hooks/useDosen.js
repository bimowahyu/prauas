import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchDosens,
  addDosen,
  updateDosen,
  deleteDosen
} from '../api';

const limit = 5;

export const useDosen = (page) => {
  const queryClient = useQueryClient();

  const {
    data: dosens = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['dosens', page, limit],
    queryFn: () => fetchDosens(page, limit).then(res => res.data),
    keepPreviousData: true
  });

  const addMutation = useMutation({
    mutationFn: addDosen,
    onSuccess: () => queryClient.invalidateQueries(['dosens']),
    onError: (error) => {
      alert(`Gagal menambahkan dosen: ${error.message}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => queryClient.invalidateQueries(['dosens']),
    onError: (error) => {
      alert(`Gagal mengupdate dosen: ${error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => queryClient.invalidateQueries(['dosens']),
    onError: (error) => {
      alert(`Gagal menghapus dosen: ${error.message}`);
    }
  });

  return {
    dosens,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit,
  };
};
