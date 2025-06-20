import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, addUser, updateUser, deleteUser } from '../api'; 

const limit = 5;

export const useUsers = (page) => {
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => fetchUsers(page, limit).then(res => res.data),
    keepPreviousData: true,
  });

  const addMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => queryClient.invalidateQueries(['users']),
    onError: (error) => {
      alert(`Gagal menambahkan user: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => queryClient.invalidateQueries(['users']),
    onError: (error) => {
      alert(`Gagal mengupdate user: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries(['users']),
    onError: (error) => {
      alert(`Gagal menghapus user: ${error.message}`);
    },
  });

  return {
    users,
    isLoading,
    isError,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
    limit,
  };
};
