import { supabase } from './supabase';

// Generate a random 6-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new quiz session
export async function createQuizSession(lessonId: string, questions: any[]) {
  const roomCode = generateRoomCode();
  
  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert({
      lesson_id: lessonId,
      room_code: roomCode,
      status: 'waiting',
      questions: questions,
      current_question: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating quiz session:', error);
    throw error;
  }

  return data;
}

// Get quiz session by room code
export async function getQuizByCode(roomCode: string) {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .single();

  if (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }

  return data;
}

// Get quiz session by ID
export async function getQuizSession(sessionId: string) {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching quiz session:', error);
    throw error;
  }

  return data;
}

// Update quiz status
export async function updateQuizStatus(sessionId: string, status: string, currentQuestion?: number) {
  const updates: any = { status };
  if (currentQuestion !== undefined) {
    updates.current_question = currentQuestion;
  }

  const { data, error } = await supabase
    .from('quiz_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }

  return data;
}

// Join quiz as participant
export async function joinQuiz(sessionId: string, displayName: string) {
  const { data, error } = await supabase
    .from('quiz_participants')
    .insert({
      session_id: sessionId,
      display_name: displayName,
      score: 0,
      answers: [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error joining quiz:', error);
    throw error;
  }

  return data;
}

// Get participants for a quiz session
export async function getParticipants(sessionId: string) {
  const { data, error } = await supabase
    .from('quiz_participants')
    .select('*')
    .eq('session_id', sessionId)
    .order('score', { ascending: false });

  if (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }

  return data;
}

// Submit answer
export async function submitAnswer(
  participantId: string, 
  questionIndex: number, 
  answerIndex: number, 
  isCorrect: boolean,
  timeTaken: number
) {
  // Get current participant data
  const { data: participant } = await supabase
    .from('quiz_participants')
    .select('*')
    .eq('id', participantId)
    .single();

  if (!participant) throw new Error('Participant not found');

  // Calculate points (faster = more points)
  const basePoints = isCorrect ? 100 : 0;
  const timeBonus = isCorrect ? Math.max(0, Math.floor((10 - timeTaken) * 10)) : 0;
  const points = basePoints + timeBonus;

  // Update answers and score
  const newAnswers = [...(participant.answers || []), { questionIndex, answerIndex, isCorrect, timeTaken, points }];
  const newScore = (participant.score || 0) + points;

  const { data, error } = await supabase
    .from('quiz_participants')
    .update({
      answers: newAnswers,
      score: newScore,
    })
    .eq('id', participantId)
    .select()
    .single();

  if (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }

  return data;
}

// Subscribe to quiz session changes
export function subscribeToQuiz(sessionId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`quiz_${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quiz_sessions',
        filter: `id=eq.${sessionId}`,
      },
      callback
    )
    .subscribe();
}

// Subscribe to participants changes
export function subscribeToParticipants(sessionId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`participants_${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quiz_participants',
        filter: `session_id=eq.${sessionId}`,
      },
      callback
    )
    .subscribe();
}

// Unsubscribe from channel
export function unsubscribe(channel: any) {
  supabase.removeChannel(channel);
}