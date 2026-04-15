import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

export default function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setLoading(true); // keep skeleton
          return;
        }

        const token = await user.getIdToken();

        const controller = new AbortController();

        // ⏱ Timeout (important)
        const timeout = setTimeout(() => {
          controller.abort();
        }, 5000); // 5 sec

        const res = await fetch(`${API}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          throw new Error("API failed");
        }

        const json = await res.json();
        setData(json);

      } catch (err) {
        console.error("Dashboard API error:", err);

        // ❗ KEEP loading TRUE → skeleton stays
        setData(null);
        return;

      } finally {
        // ✅ Only stop loading if data exists
        setLoading(data ? false : true);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
}