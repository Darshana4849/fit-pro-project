import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWorkoutPlans, getPublicWorkoutPlans, deleteWorkoutPlan } from '../../services/workoutPlanService';

const WorkoutPlanList = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [showPublic, setShowPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false);

  useEffect(() => {
    // Initialize dark mode from local storage or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      localStorage.setItem('darkMode', prefersDark);
    }
    
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setLoading(true);
        const data = showPublic 
          ? await getPublicWorkoutPlans()
          : await getWorkoutPlans();
        setWorkoutPlans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, [showPublic]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      try {
        setDeletingId(id);
        await deleteWorkoutPlan(id);
        setWorkoutPlans(workoutPlans.filter(plan => plan.id !== id));
      } catch (err) {
        setError(err.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
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
        onClick={() => setError(null)}
        className={`mt-2 px-4 py-2 ${darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'} text-white rounded-md`}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : ''} min-h-screen transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Workout Plans</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              {showPublic ? 'Browse public workout plans' : 'View your personal workout plans'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } transition-colors`}
            >
              {darkMode ? (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  
                </span>
              )}
            </button>
            <button
              onClick={() => setShowPublic(!showPublic)}
              className={`px-4 py-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : `${showPublic ? 'bg-gray-100' : 'bg-white'} border-gray-300 hover:bg-gray-50`
              } transition-colors`}
            >
              {showPublic ? 'Show My Plans' : 'Show Public Plans'}
            </button>
            <Link
              to="/workout-plans-form"
              className={`px-4 py-2 ${
                darkMode 
                  ? 'bg-blue-700 hover:bg-blue-800' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-md text-center transition-colors`}
            >
              Create New Plan
            </Link>
          </div>
        </div>

        {workoutPlans.length === 0 ? (
          <div className={`${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white'
          } rounded-lg shadow-sm p-8 text-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>No workout plans found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              {showPublic ? 'There are no public workout plans available.' : 'You haven\'t created any workout plans yet.'}
            </p>
            <Link
              to="/workout-plans-form"
              className={`inline-flex items-center px-4 py-2 ${
                darkMode 
                  ? 'bg-blue-700 hover:bg-blue-800' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-md`}
            >
              Create Your First Plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex flex-col mb-4">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} mb-3`}>
                      {plan.title || "Untitled Workout Plan"}
                    </h2>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        darkMode
                          ? plan.difficulty === 'Beginner' 
                            ? 'bg-green-900/30 text-green-300'
                            : plan.difficulty === 'Intermediate' 
                            ? 'bg-yellow-900/30 text-yellow-300'
                            : 'bg-red-900/30 text-red-300'
                          : plan.difficulty === 'Beginner' 
                            ? 'bg-green-100 text-green-800'
                            : plan.difficulty === 'Intermediate' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.difficulty || "Beginner"}
                      </span>
                      
                      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {plan.durationMinutes || 4} weeks
                      </div>
                    </div>
                    
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                      {plan.description || "No description provided."}
                    </p>

                    {/* Target Muscles */}
                    {plan.targetMuscles && plan.targetMuscles.length > 0 && (
                      <div className="mb-4">
                        <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Target Muscles:</h3>
                        <div className="flex flex-wrap gap-2">
                          {plan.targetMuscles.map((muscle, idx) => (
                            <span 
                              key={idx}
                              className={`inline-flex items-center px-2 py-1 text-xs ${
                                darkMode 
                                  ? 'bg-green-900/30 text-green-300' 
                                  : 'bg-green-100 text-green-800'
                              } rounded-full`}
                            >
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Exercises Section */}
                  <div className="mb-5">
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Exercises:</h3>
                    <div className="space-y-2">
                      {plan.exercises && plan.exercises.length > 0 ? (
                        plan.exercises.slice(0, 3).map((exercise, index) => (
                          <div 
                            key={index} 
                            className={`flex justify-between items-center ${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-200'} border-b pb-2`}
                          >
                            <span>{exercise.name}</span>
                            <span className="text-right">
                              {exercise.sets} sets × {exercise.reps || exercise.duration}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className={`text-center py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          No exercises added to this plan
                        </div>
                      )}
                      
                      {plan.exercises && plan.exercises.length > 3 && (
                        <div className={`text-center text-sm pt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          + {plan.exercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between gap-4 mt-6">
                    <Link
                      to={`/workout-plans/${plan.id}/edit`}
                      className={`px-4 py-3 ${
                        darkMode
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-amber-500 hover:bg-amber-600'
                      } text-white rounded-md text-center font-medium flex-1 transition-colors shadow-sm`}
                    >
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </span>
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(plan.id)}
                      disabled={deletingId === plan.id}
                      className={`px-4 py-3 ${
                        darkMode
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-red-500 hover:bg-red-600'
                      } text-white rounded-md text-center font-medium flex-1 transition-colors shadow-sm`}
                    >
                      <span className="flex items-center justify-center">
                        {deletingId === plan.id ? (
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </span>
                    </button>
                    
                    <Link
                      to={`/workout-plans/${plan.id}/start`}
                      className={`px-4 py-3 ${
                        darkMode
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white rounded-md text-center font-medium flex-1 transition-colors shadow-sm`}
                    >
                      <span className="flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Add this CSS to your global styles or component
const darkModeStyles = `
  body.dark-mode {
    background-color: #111827;
    color: #f3f4f6;
  }
`;

// You can include this style tag directly in your component or add it to your global CSS
const styleEl = document.createElement('style');
styleEl.textContent = darkModeStyles;
document.head.appendChild(styleEl);

export default WorkoutPlanList;