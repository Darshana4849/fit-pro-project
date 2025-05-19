import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWorkoutPlanById, createWorkoutPlan, updateWorkoutPlan } from '../../services/workoutPlanService';

/**
 * WorkoutPlanForm component for creating or editing workout plans
 * @returns {JSX.Element} The workout plan form component
 */
const WorkoutPlanForm = () => {
  // Router hooks
  const { id } = useParams(); // Get workout plan ID from URL if editing
  const navigate = useNavigate(); // Navigation function

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    durationMinutes: 4,
    targetMuscles: [],
    exercises: [],
    isPublic: false,
  });

  // Component state
  const [newTargetMuscle, setNewTargetMuscle] = useState(''); // Input for new target muscle
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false); // Dark mode state

  /**
   * Validation function to allow only letters and spaces in input
   * @param {Event} e - Keyboard event
   */
  const allowOnlyLetters = (e) => {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  /**
   * Validation function to allow only numbers in input
   * @param {Event} e - Keyboard event
   */
  const allowOnlyNumbers = (e) => {
    const regex = /^[0-9]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  /**
   * Validation function to allow numbers and hyphens in input
   * @param {Event} e - Keyboard event
   */
  const allowNumbersAndHyphen = (e) => {
    const regex = /^[0-9-]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  /**
   * Handles key press for target muscle input
   * @param {Event} e - Keyboard event
   */
  const handleTargetMuscleKeyPress = (e) => {
    allowOnlyLetters(e);
    if (e.key === 'Enter') {
      addTargetMuscle();
      e.preventDefault();
    }
  };

  // Initialize dark mode from local storage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      localStorage.setItem('darkMode', prefersDark);
    }
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Load workout plan data if editing
  useEffect(() => {
    if (id) {
      const fetchWorkoutPlan = async () => {
        try {
          setLoading(true);
          const plan = await getWorkoutPlanById(id);
          setFormData(plan);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchWorkoutPlan();
    }
  }, [id]);

  /**
   * Toggles dark mode state
   */
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  /**
   * Handles input changes for form fields
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  /**
   * Handles changes to exercise fields
   * @param {number} index - Exercise index
   * @param {string} field - Field name to update
   * @param {string|number} value - New value
   */
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === 'sets' ? parseInt(value) : value,
    };
    setFormData({
      ...formData,
      exercises: updatedExercises,
    });
  };

  /**
   * Adds a new target muscle to the form
   */
  const addTargetMuscle = () => {
    const regex = /^[A-Za-z\s]+$/;
    if (newTargetMuscle.trim() && regex.test(newTargetMuscle) && !formData.targetMuscles.includes(newTargetMuscle)) {
      setFormData({
        ...formData,
        targetMuscles: [...formData.targetMuscles, newTargetMuscle.trim()],
      });
      setNewTargetMuscle('');
    }
  };

  /**
   * Removes a target muscle from the form
   * @param {string} muscle - Muscle to remove
   */
  const removeTargetMuscle = (muscle) => {
    setFormData({
      ...formData,
      targetMuscles: formData.targetMuscles.filter((m) => m !== muscle),
    });
  };

  /**
   * Adds a new empty exercise to the form
   */
  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [
        ...formData.exercises,
        {
          name: '',
          sets: 3,
          reps: '8-12',
          duration: '',
        },
      ],
    });
  };

  /**
   * Removes an exercise from the form
   * @param {number} index - Index of exercise to remove
   */
  const removeExercise = (index) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises.splice(index, 1);
    setFormData({
      ...formData,
      exercises: updatedExercises,
    });
  };

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await updateWorkoutPlan(id, formData);
      } else {
        await createWorkoutPlan(formData);
      }
      navigate('/workout-plans');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state UI
  if (loading) return (
    <div className={`flex justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
    </div>
  );

  // Error state UI
  if (error) return (
    <div className={`bg-${darkMode ? 'red-900/30' : 'red-100'} border-l-4 border-${darkMode ? 'red-700' : 'red-500'} text-${darkMode ? 'red-400' : 'red-700'} p-4 mx-auto max-w-3xl mt-8`}>
      <p>Error: {error}</p>
      <button 
        onClick={() => setError(null)}
        className={`mt-2 px-4 py-2 bg-${darkMode ? 'red-700 hover:bg-red-800' : 'red-500 hover:bg-red-600'} text-white rounded`}
      >
        Try Again
      </button>
    </div>
  );

  // Main form UI
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden p-6`}>
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {id ? 'Edit Workout Plan' : 'Create New Workout Plan'}
          </h1>
          <div className="flex space-x-2">
            {/* Dark mode toggle button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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
            {/* Close button */}
            <button
              onClick={() => navigate('/workout-plans')}
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className={`${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} p-6 rounded-lg`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-800'} mb-4`}>Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title input */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onKeyPress={allowOnlyLetters}
                  required
                  className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg transition-all`}
                />
              </div>
              
              {/* Difficulty select */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg transition-all`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Duration input */}
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Duration (weeks)*</label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg transition-all`}
                />
              </div>
            </div>

            {/* Description textarea */}
            <div className="mt-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg transition-all`}
                placeholder="Describe the purpose and goals of this workout plan..."
              />
            </div>
          </div>

          {/* Target Muscles Section */}
          <div className={`${darkMode ? 'bg-green-900/20' : 'bg-green-50'} p-6 rounded-lg`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'} mb-4`}>Target Muscles</h2>
            {/* Add muscle input */}
            <div className="flex mb-4">
              <input
                type="text"
                value={newTargetMuscle}
                onChange={(e) => setNewTargetMuscle(e.target.value)}
                onKeyPress={handleTargetMuscleKeyPress}
                placeholder="Add target muscle (e.g. Chest, Back)"
                className={`flex-1 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500 focus:border-green-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'} rounded-l-lg transition-all`}
              />
              <button
                type="button"
                onClick={addTargetMuscle}
                className={`px-4 py-2 ${darkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-500 hover:bg-green-600'} text-white rounded-r-lg transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {/* Muscle tags */}
            <div className="flex flex-wrap gap-2">
              {formData.targetMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className={`inline-flex items-center px-3 py-1 ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'} rounded-full text-sm font-medium`}
                >
                  {muscle}
                  <button
                    type="button"
                    onClick={() => removeTargetMuscle(muscle)}
                    className={`ml-2 ${darkMode ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-900'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Exercises Section  update */}
          <div className={`${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} p-6 rounded-lg`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-800'} mb-6`}>Exercises</h2>
            
            <div className="space-y-8">
              {/* Exercise list or empty state */}
              {formData.exercises.length > 0 ? (
                formData.exercises.map((exercise, index) => (
                  <div 
                    key={index} 
                    className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 shadow-sm relative`}
                  >
                    {/* Remove exercise button */}
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className={`absolute top-4 right-4 ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </button>
                    
                    {/* Exercise header */}
                    <h3 className={`font-semibold text-lg mb-4 ${darkMode ? 'text-gray-200' : ''}`}>Exercise {index + 1}</h3>
                    
                    {/* Exercise form fields */}
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Exercise Name*</label>
                        <input
                          type="text"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                          onKeyPress={allowOnlyLetters}
                          required
                          placeholder="e.g., Squats"
                          className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500 focus:border-purple-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'} rounded-lg transition-all`}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Sets</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                              min="1"
                              className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500 focus:border-purple-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'} rounded-lg transition-all`}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Reps</label>
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                            onKeyPress={allowNumbersAndHyphen}
                            placeholder="8-12"
                            className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500 focus:border-purple-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'} rounded-lg transition-all`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>OR Duration</label>
                          <input
                            type="text"
                            value={exercise.duration}
                            onChange={(e) => handleExerciseChange(index, 'duration', e.target.value)}
                            placeholder="e.g., 30 sec"
                            className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500 focus:border-purple-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'} rounded-lg transition-all`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="mt-2">No exercises added yet</p>
                </div>
              )}
              
              {/* Add exercise button */}
              <button
                type="button"
                onClick={addExercise}
                className={`w-full flex items-center justify-center px-4 py-3 ${
                  darkMode 
                    ? 'border-2 border-dashed border-gray-600 text-purple-400 hover:border-purple-500 hover:bg-purple-900/20' 
                    : 'border-2 border-dashed border-gray-300 text-purple-600 hover:border-purple-400 hover:bg-purple-50'
                } rounded-lg transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Your Exercise 
              </button>
            </div>
          </div>

          {/* Form actions */}
          <div className={`flex justify-end space-x-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              type="button"
              onClick={() => navigate('/workout-plans')}
              className={`px-6 py-2 ${
                darkMode 
                  ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              } rounded-lg transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 ${
                darkMode 
                  ? 'bg-blue-700 hover:bg-blue-800' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-lg transition-colors`}
            >
              {id ? 'Update Workout Plan' : 'Create Workout Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dark mode styles
const darkModeStyles = `
  body.dark-mode {
    background-color: #111827;
    color: #f3f4f6;
  }
`;

// Inject dark mode styles
const styleEl = document.createElement('style');
styleEl.textContent = darkModeStyles;
document.head.appendChild(styleEl);

export default WorkoutPlanForm;