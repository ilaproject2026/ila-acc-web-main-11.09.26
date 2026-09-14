import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { SharedCourse } from '../types/course';

export function useCourseDetail(courseId: string | null) {
  const [course, setCourse] = useState<SharedCourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setCourse(null);
      setLoading(false);
      return;
    }

    async function load() {
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let { data, error: qErr } = await supabase
          .from('library_courses')
          .select('*')
          .eq('id', courseId)
          .maybeSingle();

        if (qErr && (qErr.code === '42P01' || qErr.message?.includes('does not exist'))) {
          const fallbackRes = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .maybeSingle();
          data = fallbackRes.data;
          qErr = fallbackRes.error;
        }

        if (qErr) throw qErr;
        setCourse(data || null);
      } catch (err: any) {
        setError(err?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [courseId]);

  return { course, loading, error };
}
