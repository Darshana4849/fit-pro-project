import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWorkoutPlanById } from '../../services/workoutPlanService';

/**
 * WorkoutExecution component handles the actual execution of a workout plan,
 * including exercise tracking, timer functionality, and progress monitoring.
 */
const WorkoutExecution = () => {
  // Get route parameters and navigation hook
  const { id } = useParams();
  const navigate = useNavigate();

  // State management:
  const [workoutPlan, setWorkoutPlan] = useState(null); // Current workout plan data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // Current exercise index
  const [completedExercises, setCompletedExercises] = useState([]); // Completed exercises
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isActive, setIsActive] = useState(false); // Timer active state
  const [isPaused, setIsPaused] = useState(true); // Timer paused state
  const [showComplete, setShowComplete] = useState(false); // Workout completion state

  // Fetch workout plan data when component mounts
  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        setLoading(true);
        const plan = await getWorkoutPlanById(id);
        setWorkoutPlan(plan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [id]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  /**
   * Formats time in seconds to mm:ss format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer control functions
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setTimer(0);
    setIsPaused(true);
  };

  /**
   * Marks current exercise as completed and moves to next exercise
   * or completes workout if last exercise
   */
  const handleCompleteExercise = () => {
    if (!workoutPlan || !workoutPlan.exercises) return;
    
    const currentExercise = workoutPlan.exercises[currentExerciseIndex];
    
    setCompletedExercises([...completedExercises, {
      ...currentExercise,
      completedAt: new Date().toISOString()
    }]);
    
    if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout completed
      setShowComplete(true);
      setIsActive(false);
      setIsPaused(true);
    }
  };

  /**
   * Moves back to previous exercise and removes it from completed list
   */
  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      
      // Remove the exercise from completed list
      const newCompleted = [...completedExercises];
      newCompleted.pop();
      setCompletedExercises(newCompleted);
    }
  };

  /**
   * Handles workout completion (navigates back to workout plans)
   */
  const handleCompleteWorkout = () => {
    navigate(`/workout-plans`);
  };

  /**
   * Calculates workout progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  const calculateProgress = () => {
    if (!workoutPlan || !workoutPlan.exercises || workoutPlan.exercises.length === 0) return 0;
    return (completedExercises.length / workoutPlan.exercises.length) * 100;
  };

  // Loading state UI
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Error state UI
  if (error) return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-red-50 border-l-4 border-red-500">
      <p className="text-red-700">Error: {error}</p>
      <button 
        onClick={() => setError(null)}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Try Again
      </button>
    </div>
  );

  if (!workoutPlan) return null;

  // Get current exercise or null if no exercises
  const currentExercise = workoutPlan.exercises && workoutPlan.exercises.length > 0 
    ? workoutPlan.exercises[currentExerciseIndex] 
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header with back button and timer */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to={`/workout-plans/${id}`} className="text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Workout Plan
          </Link>
        </div>
        <div>
          <span className="font-medium text-gray-900">Total Time:</span> {formatTime(timer)}
        </div>
      </div>

      {/* Workout Info Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{workoutPlan.title}</h1>
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-gray-600">{workoutPlan.workoutType || 'Workout'}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{workoutPlan.difficulty || 'All Levels'}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{workoutPlan.durationMinutes || '0'} mins</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {completedExercises.length} of {workoutPlan.exercises?.length || 0} exercises
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Conditional rendering based on workout completion */}
      {showComplete ? (
        /* Workout Complete Screen */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Workout Complete!</h2>
            <p className="text-gray-600 mb-6">Great job! You've completed all exercises in this workout plan.</p>
            <div className="flex flex-col space-y-4 max-w-md mx-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Total Time:</span>
                  <span className="font-medium">{formatTime(timer)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Exercises Completed:</span>
                  <span className="font-medium">{completedExercises.length}</span>
                </div>
              </div>
              <button
                onClick={handleCompleteWorkout}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Finish Workout
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Workout Execution Screen */
        <>
          {currentExercise ? (
            /* Current Exercise Section */
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Current Exercise</h2>
              </div>
              <div className="px-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                    {currentExercise.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-700">
                    {currentExercise.sets && (
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {currentExercise.sets} sets
                      </span>
                    )}
                    {currentExercise.reps && (
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {currentExercise.reps} reps
                      </span>
                    )}
                    {currentExercise.duration && (
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {currentExercise.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Exercise Instructions */}
                {currentExercise.instructions && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                    <p className="text-gray-700">{currentExercise.instructions}</p>
                  </div>
                )}

                {/* Timer Controls */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-gray-900">{formatTime(timer)}</span>
                  </div>
                  <div className="flex justify-center space-x-4">
                    {!isActive ? (
                      <button
                        onClick={handleStart}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Start Timer
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseResume}
                        className={`px-4 py-2 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white rounded flex items-center`}
                      >
                        {isPaused ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Resume
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Pause
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Reset
                    </button>
                  </div>
                </div>

                {/* Exercise Navigation Controls */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePreviousExercise}
                    disabled={currentExerciseIndex === 0}
                    className={`px-4 py-2 rounded flex items-center ${
                      currentExerciseIndex === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={handleCompleteExercise}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                  >
                    {currentExerciseIndex === workoutPlan.exercises.length - 1 ? (
                      <>
                        Complete Workout
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Next Exercise
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* No Exercises Found State */
            <div className="bg-white rounded-lg shadow overflow-hidden p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-gray-700">No exercises found in this workout plan.</p>
              <Link 
                to={`/workout-plans/${id}`}
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Return to Plan Details
              </Link>
            </div>
          )}

          {/* Exercise List Section */}
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Exercises</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {workoutPlan.exercises && workoutPlan.exercises.map((exercise, index) => (
                <li 
                  key={index}
                  className={`px-6 py-4 flex items-center ${index === currentExerciseIndex ? 'bg-blue-50' : ''}`}
                >
                  <div className="mr-4 flex-shrink-0">
                    {completedExercises.some(e => e.name === exercise.name) ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : index === currentExerciseIndex ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${index === currentExerciseIndex ? 'text-blue-700' : 'text-gray-900'}`}>
                      {exercise.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {exercise.sets && `${exercise.sets} sets`} 
                      {exercise.sets && exercise.reps && ' • '}
                      {exercise.reps && `${exercise.reps} reps`}
                      {(exercise.sets || exercise.reps) && exercise.duration && ' • '}
                      {exercise.duration && exercise.duration}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutExecution;