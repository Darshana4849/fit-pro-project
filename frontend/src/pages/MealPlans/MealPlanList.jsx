import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMealPlans, getPublicMealPlans, deleteMealPlan } from '../../services/mealPlanService';

const MealPlanList = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [showPublic, setShowPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

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
    const fetchMealPlans = async () => {
      try {
        setLoading(true);
        const data = showPublic 
          ? await getPublicMealPlans()
          : await getMealPlans();
        setMealPlans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, [showPublic]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        setDeletingId(id);
        await deleteMealPlan(id);
        setMealPlans(mealPlans.filter(plan => plan.id !== id));
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

  // Function to get the appropriate color classes based on difficulty level
  const getDifficultyColorClasses = (difficulty) => {
    if (darkMode) {
      switch(difficulty?.toLowerCase()) {
        case 'beginner': return 'bg-green-900/30 text-green-300';
        case 'intermediate': return 'bg-yellow-900/30 text-yellow-300';
        case 'advanced': return 'bg-red-900/30 text-red-300';
        default: return 'bg-blue-900/30 text-blue-300';
      }
    } else {
      switch(difficulty?.toLowerCase()) {
        case 'beginner': return 'bg-green-100 text-green-800';
        case 'intermediate': return 'bg-yellow-100 text-yellow-800';
        case 'advanced': return 'bg-red-100 text-red-800';
        default: return 'bg-blue-100 text-blue-800';
      }
    }
  };
  
  const toggleExpandPlan = (id) => {
    setExpandedPlanId(expandedPlanId === id ? null : id);
  };

  // Function to get the appropriate color classes based on plan type
  const getTypeColorClasses = (type) => {
    if (darkMode) {
      switch(type?.toLowerCase()) {
        case 'strength': return 'text-purple-300';
        case 'cardio': return 'text-blue-300';
        case 'flexibility': return 'text-indigo-300';
        default: return 'text-gray-300';
      }
    } else {
      switch(type?.toLowerCase()) {
        case 'strength': return 'text-purple-600';
        case 'cardio': return 'text-blue-600';
        case 'flexibility': return 'text-indigo-600';
        default: return 'text-gray-600';
      }
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
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Meal Plans</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              {showPublic ? 'Browse public meal plans' : 'View your personal meal plans'}
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
              to="/meal-plans-form"
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

        {mealPlans.length === 0 ? (
          <div className={`${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white'
          } rounded-lg shadow-sm p-8 text-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>No meal plans found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              {showPublic ? 'There are no public meal plans available.' : 'You haven\'t created any meal plans yet.'}
            </p>
            <Link
              to="/meal-plans/create"
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
            {mealPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                } border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="p-5">
                  {/* Title section */}
                  <div className="mb-4">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {plan.title}
                    </h2>
                  </div>

                  {/* Difficulty, duration, and type */}
                  <div className="flex items-center mb-4 gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColorClasses(plan.difficulty || plan.dietType)}`}>
                      {plan.difficulty || plan.dietType || 'Standard'}
                    </span>
                    
                    <div className="flex items-center text-sm gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {plan.duration || (plan.durationDays + ' days')}
                      </span>
                    </div>
                    
                    <span className={`text-sm ${getTypeColorClasses(plan.type)}`}>
                      {plan.type || 'Diet'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    {plan.description}
                  </p>

                  {/* Exercises/Meals section */}
                  <div className="mb-6">
                    <h3 className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium mb-2`}>
                      {plan.meals ? 'Meals:' : 'Exercises:'}
                    </h3>
                    
                    <div className="space-y-3">
                      {/* If we have exercises */}
                      {plan.exercises && plan.exercises.map((exercise, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {exercise.name}
                          </span>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                            {exercise.sets} sets × {exercise.reps}
                          </span>
                        </div>
                      ))}
                      
                      {/* If we have meals instead of exercises */}
                      {plan.meals && plan.meals.slice(0, 3).map((meal, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {meal.name}
                          </span>
                          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                            {meal.calories} cal
                          </span>
                        </div>
                      ))}

                      {/* Show if there are more meals than we displayed */}
                      {plan.meals && plan.meals.length > 3 && !expandedPlanId && (
                        <div className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          +{plan.meals.length - 3} more meals
                        </div>
                      )}
                    </div>
                    
                    {/* Toggle button to expand/collapse details */}
                    {plan.meals && plan.meals.length > 0 && (
                      <button
                        onClick={() => toggleExpandPlan(plan.id)}
                        className={`flex items-center w-full justify-center py-2 mt-4 text-sm font-medium rounded-md border ${
                          darkMode 
                            ? 'text-blue-300 border-blue-800 hover:bg-blue-900/20' 
                            : 'text-blue-600 border-blue-200 hover:bg-blue-50'
                        } transition-colors`}
                      >
                        {expandedPlanId === plan.id ? 'Hide Details' : 'Show Meal Details'}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ml-2 transition-transform ${expandedPlanId === plan.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Expanded meal details */}
                  {expandedPlanId === plan.id && plan.meals && plan.meals.length > 0 && (
                    <div className={`space-y-4 mb-6 ${darkMode ? 'bg-gray-900/30' : 'bg-gray-50'} p-4 rounded-lg`}>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} pb-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        Meals in this plan
                      </h3>
                      {plan.meals.map((meal, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{meal.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              meal.timeOfDay === 'Breakfast'
                                ? darkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-800'
                                : meal.timeOfDay === 'Lunch'
                                ? darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
                                : meal.timeOfDay === 'Dinner'
                                ? darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                                : darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {meal.timeOfDay}
                            </span>
                          </div>
                          
                          {meal.description && (
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                              {meal.description}
                            </p>
                          )}
                          
                          <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                            {meal.calories} calories
                          </div>
                          
                          {/* Ingredients */}
                          {meal.ingredients && meal.ingredients.length > 0 && (
                            <div className="mb-3">
                              <h5 className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                                Ingredients
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {meal.ingredients.map((ingredient, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-xs px-2 py-1 rounded ${
                                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {ingredient.name} ({ingredient.amount})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Preparation instructions - collapsed by default */}
                          {meal.preparation && (
                            <details className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <summary className={`cursor-pointer font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'} hover:underline`}>
                                Preparation Instructions
                              </summary>
                              <p className="mt-2 pl-2 border-l-2 border-gray-600">{meal.preparation}</p>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className={`flex justify-between ${darkMode ? 'border-gray-700' : 'border-gray-100'} ${expandedPlanId === plan.id ? 'border-t pt-4' : ''}`}>
                    <Link
                      to={`/meal-plans/${plan.id}/edit`}
                      className={`flex-1 mr-2 py-2 px-3 text-center text-sm font-medium ${
                        darkMode 
                          ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                      } border rounded-md transition-colors`}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      disabled={deletingId === plan.id}
                      className={`flex-1 ml-2 py-2 px-3 text-center text-sm font-medium ${
                        darkMode 
                          ? 'text-red-400 border-red-900 hover:bg-red-900/30' 
                          : 'text-red-600 border-red-300 hover:bg-red-50'
                      } border rounded-md disabled:opacity-50 transition-colors`}
                    >
                      {deletingId === plan.id ? (
                        <svg className={`animate-spin h-4 w-4 mx-auto ${darkMode ? 'text-red-400' : 'text-red-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Delete'
                      )}
                    </button>
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

export default MealPlanList;