import { supabase } from './supabase';

interface LessonData {
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  teachingMode: string;
  originalContent?: string;
  generatedPlan: any;
}

// Save a new lesson
export async function saveLesson(lesson: LessonData) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // If no user, return a temporary lesson object (not saved to DB)
  if (!user) {
    return {
      id: 'guest-' + Date.now(),
      ...lesson,
      teacher_id: null,
      created_at: new Date().toISOString(),
      title: lesson.title,
      subject: lesson.subject,
      grade_level: lesson.gradeLevel,
      teaching_mode: lesson.teachingMode,
      generated_plan: lesson.generatedPlan,
    };
  }

  const { data, error } = await supabase
    .from('lessons')
    .insert({
      teacher_id: user.id,
      title: lesson.title,
      subject: lesson.subject,
      grade_level: lesson.gradeLevel,
      teaching_mode: lesson.teachingMode,
      original_content: lesson.originalContent || '',
      generated_plan: lesson.generatedPlan,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving lesson:', error);
    throw error;
  }

  return data;
}

// Get all lessons for current user
export async function getLessons() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }

  return data;
}

// Get single lesson by ID
export async function getLesson(id: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lesson:', error);
    throw error;
  }

  return data;
}

// Delete a lesson
export async function deleteLesson(id: string) {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }

  return true;
}