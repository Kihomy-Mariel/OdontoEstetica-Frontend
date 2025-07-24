export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return {
    user,
    isAuthenticated: !!user?.token,
  };
};
