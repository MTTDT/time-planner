"use client"
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ['/login', '/register'];
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const isPublicPath = publicPaths.includes(pathname);

      if (!token && !isPublicPath) {
        router.push('/login');
        return;
      }

      if (token && !isPublicPath) {
        try {
          await axios.get('http://localhost:8080/auth/home', {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          setAuthorized(true);
        } catch (err) {
          console.error("Auth error:", err);
          localStorage.removeItem('token');
          router.push('/login');
        }
      } else if (isPublicPath) {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [pathname]);

  return authorized ? children : null;
}