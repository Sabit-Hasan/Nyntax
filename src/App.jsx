import { Outlet } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';


export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <main>
        {isLoading ? <LoadingSpinner /> : <Outlet />}
      </main>
    </>
  )
}