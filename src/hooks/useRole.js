/* eslint-disable no-unused-vars */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {fetchRoles, addRole, updateRole, deleteRole} from '../api'

const limit = 5;

export const useRole = (page) => {
  const queryClient = useQueryClient();

  const {
    data: roles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['roles', page, limit],
    queryFn: () => fetchRoles(page, limit).then(res => res.data),
    keepPreviousData: true,
  });

  const addMutation = useMutation({
    mutationFn: addRole,
    onSuccess: () => queryClient.invalidateQueries(['roles']),
    onError: (error) => {
      alert(`Gagal menambahkan user: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: () => queryClient.invalidateQueries(['roles']),
    onError: (error) => {
      alert(`Gagal mengupdate user: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => queryClient.invalidateQueries(['roles']),
    onError: (error) => {
      alert(`Gagal menghapus user: ${error.message}`);
    },
  });

  return {
    roles,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit,
  };
};
