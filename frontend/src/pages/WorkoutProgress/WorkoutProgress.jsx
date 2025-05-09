import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWorkoutPlan, updateWorkoutProgress } from '../../services/workoutPlanService';

const WorkoutProgress = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState([]);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        setLoading(true);
        const data = await getWorkoutPlan(planId);
        setWorkoutPlan(data);
        
        // Initialize sets tracking for the first exercise if exercises exist
        if (data.exercises && data.exercises.length > 0) {
          initializeSetsForExercise(data.exercises[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [planId]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const initializeSetsForExercise = (exercise) => {
    const initialSets = Array(exercise.sets).fill().map((_, i) => ({
      completed: false,
      weight: '',
      reps: exercise.reps || '',
      duration: exercise.duration || ''
    }));
    setSets(initialSets);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const toggleSetCompletion = (setIndex) => {
    setSets(currentSets => 
      currentSets.map((set, idx) => 
        idx === setIndex ? { ...set, completed: !set.completed } : set
      )
    );
  };

  const updateSetValue = (setIndex, field, value) => {
    setSets(currentSets => 
      currentSets.map((set, idx) => 
        idx === setIndex ? { ...set, [field]: value } : set
      )
    );
  };

  const handleNextExercise = () => {
    if (!workoutPlan?.exercises) return;
    
    // Add current exercise to completed with its sets data
    const currentExercise = workoutPlan.exercises[currentExerciseIndex];
    setCompletedExercises([
      ...completedExercises, 
      { 
        ...currentExercise,
        completedSets: sets,
        notes: notes 
      }
    ]);
    
    // Clear notes for next exercise
    setNotes('');
    
    // Move to next exercise or show completion modal
    if (currentExerciseIndex < workoutPlan.exercises.length - 1) {
      const nextExerciseIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextExerciseIndex);
      initializeSetsForExercise(workoutPlan.exercises[nextExerciseIndex]);
    } else {
      setShowCompleteModal(true);
      setIsTimerRunning(false);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      const prevExerciseIndex = currentExerciseIndex - 1;
      setCurrentExerciseIndex(prevExerciseIndex);
      
      // Restore the sets data for the previous exercise
      if (completedExercises.length > 0) {
        const lastCompletedExercise = completedExercises[completedExercises.length - 1];
        setSets(lastCompletedExercise.completedSets || []);
        setNotes(lastCompletedExercise.notes || '');
        
        // Remove the last completed exercise from the list
        setCompletedExercises(completedExercises.slice(0, -1));
      } else {
        initializeSetsForExercise(workoutPlan.exercises[prevExerciseIndex]);
      }
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      const workoutData = {
        planId,
        date: new Date().toISOString(),
        duration: timer,
        exercises: [
          ...completedExercises,
          // Add the current exercise if it's not already included
          {
            ...workoutPlan.exercises[currentExerciseIndex],
            completedSets: sets,
            notes: notes
          }
        ]
      };
      
      await updateWorkoutProgress(workoutData);
      navigate('/workout-history');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelWorkout = () => {
    if (window.confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
      navigate('/workout-plans');
    }
  };

  if (loading) return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : ''}`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
    </div>
  );

  if (error) return (
    <div className={`max-w-2xl mx-auto mt-8 p-4 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-500'} border-l-4`}>
      <p className={`${darkMode ? 'text-red-400' : 'text-red-700'}`}>Error: {error}</p>
      <button 
        onClick={() => navigate('/workout-plans')}
        className={`mt-2 px-4 py-2 ${darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'} text-white rounded-md`}
      >
        Back to Workout Plans
      </button>
    </div>
  );

  if (!workoutPlan || !workoutPlan.exercises || workoutPlan.exercises.length === 0) return (
    <div className={`max-w-2xl mx-auto mt-8 p-4 ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-500'} border-l-4`}>
      <p className={`${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
        This workout plan has no exercises to complete.
      </p>
      <button 
        onClick={() => navigate('/workout-plans')}
        className={`mt-2 px-4 py-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md`}
      >
        Back to Workout Plans
      </button>
    </div>
  );

  const currentExercise = workoutPlan.exercises[currentExerciseIndex];
  const progress = Math.round(((currentExerciseIndex) / workoutPlan.exercises.length) * 100);
  const allSetsCompleted = sets.every(set => set.completed);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : ''} min-h-screen transition-colors duration-200`}>
      {/* Workout Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6 max-w-md w-full`}>
            <div className="text-center mb-6">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'} mb-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Workout Complete!</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                You've completed all exercises in {formatTime(timer)}
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Your Workout Summary:</h4>
              <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>• Duration: {formatTime(timer)}</li>
                <li>• Exercises: {workoutPlan.exercises.length}</li>
                <li>• Plan: {workoutPlan.title}</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCompleteWorkout}
                className={`w-full py-3 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md font-medium`}
              >
                Save Progress
              </button>
              <Link
                to="/workout-plans"
                className={`w-full py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'} rounded-md text-center font-medium`}
              >
                Exit Without Saving
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{workoutPlan.title}</h1>
              <div className="flex items-center">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mr-4`}>
                  <svg className="inline-block h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(timer)}
                </span>
                <span className={`inline-flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Exercise {currentExerciseIndex + 1} of {workoutPlan.exercises.length}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleCancelWorkout}
                className={`p-2 rounded-md ${darkMode ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-100 hover:bg-red-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div 
          className={`h-1 ${darkMode ? 'bg-blue-500' : 'bg-blue-600'} transition-all duration-300`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Current Exercise */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden mb-6`}>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-4 py-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentExercise.name}
            </h2>
          </div>
          
          <div className="p-4">
            {/* Exercise Instructions */}
            {currentExercise.instructions && (
              <div className="mb-4">
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Instructions:</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentExercise.instructions}
                </p>
              </div>
            )}
            
            {/* Sets Tracking */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
                Sets ({sets.filter(set => set.completed).length}/{currentExercise.sets}):
              </h3>
              
              <div className={`rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                {/* Header Row */}
                <div className={`grid grid-cols-12 gap-1 px-4 py-2 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
                  <div className="col-span-1">Set</div>
                  <div className="col-span-3">Weight</div>
                  <div className="col-span-3">{currentExercise.duration ? 'Duration' : 'Reps'}</div>
                  <div className="col-span-5 text-center">Status</div>
                </div>
                
                {/* Set Rows */}
                {sets.map((set, idx) => (
                  <div 
                    key={idx} 
                    className={`grid grid-cols-12 gap-1 px-4 py-3 ${idx !== sets.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ''}`}
                  >
                    <div className={`col-span-1 flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {idx + 1}
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={set.weight}
                        onChange={(e) => updateSetValue(idx, 'weight', e.target.value)}
                        placeholder="lbs/kg"
                        className={`block w-full px-3 py-1 text-sm rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={currentExercise.duration ? set.duration : set.reps}
                        onChange={(e) => updateSetValue(idx, currentExercise.duration ? 'duration' : 'reps', e.target.value)}
                        placeholder={currentExercise.duration ? "min:sec" : "count"}
                        className={`block w-full px-3 py-1 text-sm rounded border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                            : 'border-gray-300 focus:border-blue-500'
                        } focus:outline-none`}
                      />
                    </div>
                    <div className="col-span-5 flex justify-center">
                      <button
                        onClick={() => toggleSetCompletion(idx)}
                        className={`w-full py-1 px-3 rounded text-sm font-medium transition-colors ${
                          set.completed
                            ? darkMode 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-green-500 hover:bg-green-600 text-white'
                            : darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {set.completed ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="notes" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                Notes:
              </label>
              <textarea
                id="notes"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this exercise..."
                className={`block w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900 placeholder-gray-400'
                } border focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePreviousExercise}
            disabled={currentExerciseIndex === 0}
            className={`flex-1 py-3 ${
              currentExerciseIndex === 0
                ? darkMode 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } rounded-md font-medium flex justify-center items-center shadow-sm`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <button
            onClick={handleNextExercise}
            className={`flex-1 py-3 ${
              darkMode 
                ? allSetsCompleted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700/50 hover:bg-blue-700/70'
                : allSetsCompleted ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'
            } text-white rounded-md font-medium flex justify-center items-center shadow-sm`}
          >
            {currentExerciseIndex < workoutPlan.exercises.length - 1 ? (
              <>
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                Complete Workout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </div>
        
        {/* Exercise List Progress */}
        <div className={`mt-8 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Workout Progress</h3>
          </div>
          
          <ul>
            {workoutPlan.exercises.map((exercise, idx) => {
              const isCompleted = idx < currentExerciseIndex;
              const isCurrent = idx === currentExerciseIndex;
              
              return (
                <li 
                  key={idx}
                  className={`px-4 py-3 flex items-center justify-between ${
                    idx !== workoutPlan.exercises.length - 1 
                      ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
                      : ''
                  } ${
                    isCurrent
                      ? darkMode 
                        ? 'bg-blue-900/20'
                        : 'bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                      isCompleted
                        ? darkMode 
                          ? 'bg-green-600 text-white'
                          : 'bg-green-500 text-white'
                        : isCurrent
                          ? darkMode 
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : darkMode 
                            ? 'border border-gray-600 text-gray-400'
                            : 'border border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isCurrent ? (
                        <span className="text-sm font-medium">
                          {idx + 1}
                        </span>
                      ) : (
                        <span className="text-sm font-medium">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <span className={`font-medium ${
                      isCurrent
                        ? darkMode 
                          ? 'text-white'
                          : 'text-gray-900'
                        : isCompleted
                          ? darkMode 
                            ? 'text-gray-300'
                            : 'text-gray-500'
                          : darkMode 
                            ? 'text-gray-400'
                            : 'text-gray-600'
                    }`}>
                      {exercise.name}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    isCompleted
                      ? darkMode 
                        ? 'text-green-400'
                        : 'text-green-600'
                      : isCurrent
                        ? darkMode 
                          ? 'text-blue-400'
                          : 'text-blue-600'
                        : darkMode 
                          ? 'text-gray-500'
                          : 'text-gray-400'
                  }`}>
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkoutProgress;