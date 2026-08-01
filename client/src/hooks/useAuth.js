import { useSelector } from 'react-redux';

/**
 * hooks/useAuth.js
 * ------------------------------------------------------------------
 * PURPOSE
 * A tiny convenience hook so components don't have to repeat
 * `useSelector((state) => state.auth)` everywhere. Returns the whole
 * auth slice: { user, token, isAuthenticated, loading, error }.
 */
function useAuth() {
  return useSelector((state) => state.auth);
}

export default useAuth;
