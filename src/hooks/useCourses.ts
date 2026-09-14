import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { SharedCourse } from '../types/course';

interface UseCoursesOptions {
  category?: string;
  enableRealtime?: boolean;
}

export function useCourses(options?: UseCoursesOptions) {
  const [courses, setCourses] = useState<SharedCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured in .env');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Primary query against library_courses (with fallback to courses view)
      let query = supabase
        .from('library_courses')
        .select('*')
        .order('updated_at', { ascending: false });

      if (options?.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }

      let { data, error: queryError } = await query;

      // Fallback if table is aliased as courses
      if (queryError && (queryError.code === '42P01' || queryError.message?.includes('does not exist'))) {
        let fallbackQuery = supabase
          .from('courses')
          .select('*')
          .order('updated_at', { ascending: false });

        if (options?.category && options.category !== 'all') {
          fallbackQuery = fallbackQuery.eq('category', options.category);
        }

        const fallbackRes = await fallbackQuery;
        data = fallbackRes.data;
        queryError = fallbackRes.error;
      }

      if (queryError) throw queryError;
      setCourses(data || []);
    } catch (err: any) {
      console.error('[useCourses] Fetch error:', err);
      setError(err?.message || 'Failed to fetch courses from Supabase');
    } finally {
      setLoading(false);
    }
  }, [options?.category]);

  useEffect(() => {
    fetchCourses();

    // Optional: Real-time Live Subscription
    // Automatically re-fetches when a course is generated or updated in the Course Creator
    if (options?.enableRealtime && supabase) {
      const channel = supabase
        .channel('realtime_shared_courses')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'library_courses' },
          () => {
            fetchCourses();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchCourses, options?.enableRealtime]);

  return { courses, loading, error, refetch: fetchCourses };
}
