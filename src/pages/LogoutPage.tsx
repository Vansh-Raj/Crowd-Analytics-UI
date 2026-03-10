import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../lib/api';

function LogoutPage() {
  const navigate = useNavigate();
  useEffect(() => {
    clearToken();
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
}

export default LogoutPage;
