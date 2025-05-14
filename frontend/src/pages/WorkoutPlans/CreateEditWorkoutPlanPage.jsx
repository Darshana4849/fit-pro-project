import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getWorkoutPlanById,
  createWorkoutPlan,
  updateWorkoutPlan,
} from '../../services/workoutPlanService';

const CreateEditWorkoutPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    durationMinutes: 4,
    targetMuscles: [],
    exercises: [],
    isPublic: false,
  });
  const [newTargetMuscle, setNewTargetMuscle] = useState('');
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: '8-12',
    duration: '',
  });
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null);
  const [editingExercise, setEditingExercise] = useState({
    name: '',
    sets: 3,
    reps: '8-12',
    duration: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false);

  // Validation function for letters and spaces only
  const allowOnlyLetters = (e) => {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(e.key)) {
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
    
    // Apply dark mode class to body
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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({
      ...newExercise,
      [name]: value,
    });
  };

  const handleEditingExerciseInputChange = (e) => {
    const { name, value } = e.target;
    setEditingExercise({
      ...editingExercise,
      [name]: value,
    });
  };

  const addTargetMuscle = () => {
    const trimmedMuscle = newTargetMuscle.trim();
    if (trimmedMuscle && !formData.targetMuscles.includes(trimmedMuscle) && /^[A-Za-z\s]+$/.test(trimmedMuscle)) {
      setFormData({
        ...formData,
        targetMuscles: [...formData.targetMuscles, trimmedMuscle],
      });
      setNewTargetMuscle('');
    }
  };

  const removeTargetMuscle = (muscle) => {
    setFormData({
      ...formData,
      targetMuscles: formData.targetMuscles.filter((m) => m !== muscle),
    });
  };

  const addExercise = () => {
    if (newExercise.name.trim() && /^[A-Za-z\s]+$/.test(newExercise.name.trim())) {
      setFormData({
        ...formData,
        exercises: [...formData.exercises, { ...newExercise }],
      });
      setNewExercise({
        name: '',
        sets: 3,
        reps: '8-12',
        duration: '',
      });
    }
  };

  const removeExercise = (index) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises.splice(index, 1);
    setFormData({
      ...formData,
      exercises: updatedExercises,
    });
    if (editingExerciseIndex === index) {
      setEditingExerciseIndex(null);
    }
  };

  const startEditingExercise = (index) => {
    setEditingExerciseIndex(index);
    setEditingExercise({ ...formData.exercises[index] });
  };

  const saveEditedExercise = () => {
    if (editingExercise.name.trim() && /^[A-Za-z\s]+$/.test(editingExercise.name.trim())) {
      const updatedExercises = [...formData.exercises];
      updatedExercises[editingExerciseIndex] = { ...editingExercise };
      setFormData({
        ...formData,
        exercises: updatedExercises,
      });
      setEditingExerciseIndex(null);
      setEditingExercise({
        name: '',
        sets: 3,
        reps: '8-12',
        duration: '',
      });
    }
  };

  const cancelEditingExercise = () => {
    setEditingExerciseIndex(null);
    setEditingExercise({
      name: '',
      sets: 3,
      reps: '8-12',
      duration: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[A-Za-z\s]+$/.test(formData.title.trim())) {
      setError('Plan Title must contain only letters and spaces.');
      return;
    }
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

  if (loading) return (
    <div className={`fixed inset-0 flex justify-center items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} bg-opacity-80 z-50`}>
      <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${darkMode ? 'border-purple-500' : 'border-purple-600'}`}></div>
    </div>
  );

  if (error) return (
    <div className={`max-w-3xl mx-auto mt-12 p-6 ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} border-l-4 ${darkMode ? 'border-red-700' : 'border-red-500'} rounded-lg shadow-md ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
      <div className="flex items-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-red-300' : 'text-red-500'} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className={`text-lg font-medium ${darkMode ? 'text-red-200' : 'text-red-800'}`}>Something went wrong</h3>
      </div>
      <p className={`mb-4 ${darkMode ? 'text-red-200' : 'text-red-800'}`}>{error}</p>
      <div className="flex space-x-3">
        <button 
          onClick={() => setError(null)}
          className={`px-5 py-2 ${darkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md transition duration-200 shadow-sm`}
        >
          Try Again
        </button>
        <button 
          onClick={() => navigate('/workout-plans')}
          className={`px-5 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-200 border-gray-300 hover:bg-gray-300'} border rounded-md transition duration-200`}
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12`}>
      <div className={`max-w-3xl mx-auto px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
        <div className={`pt-10 pb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {id ? 'Edit Workout Plan' : 'Create Workout Plan'}
              </h1>
              <p className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} font-medium`}>
                {id ? 'Update your existing workout plan' : 'Design your perfect fitness journey'}
              </p>
            </div>
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
          </div>
        </div>

        <form onSubmit={handleSubmit} className="py-8 space-y-10">
          {/* Basic Information Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Basic Information</h2>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6 shadow-sm`}>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Plan Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onKeyPress={allowOnlyLetters}
                  required
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="e.g., Beginner Full Body Workout"
                />
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty Level*</label>
                <div className="flex flex-wrap gap-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <label key={level} className={`flex items-center px-4 py-2 rounded-lg border ${formData.difficulty === level ? `${darkMode ? 'bg-purple-900 border-purple-500 ring-2 ring-purple-700' : 'bg-purple-100 border-purple-300 ring-2 ring-purple-200'}` : `${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`} cursor-pointer transition duration-200`}>
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={formData.difficulty === level}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 hidden"
                      />
                      <span className={`text-base ${formData.difficulty === level ? `${darkMode ? 'text-purple-300' : 'text-purple-800'} font-medium` : `${darkMode ? 'text-gray-300' : 'text-gray-700'}`}`}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration (minutes)*</label>
                  <input
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    placeholder="e.g., 30 minutes"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Describe the workout plan, its benefits, and who it's for..."
                  required
                />
              </div>
            </div>
          </section>

          {/* Target Muscles Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 ${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Target Muscles</h2>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl p-6 shadow-sm`}>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newTargetMuscle}
                  onChange={(e) => setNewTargetMuscle(e.target.value)}
                  onKeyPress={(e) => {
                    allowOnlyLetters(e);
                    if (e.key === 'Enter') addTargetMuscle();
                  }}
                  placeholder="Add target muscle (e.g. Chest, Back)"
                  className={`flex-1 px-4 py-3 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
                <button
                  type="button"
                  onClick={addTargetMuscle}
                  className={`px-4 py-3 ${darkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white rounded-r-lg transition-colors`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.targetMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}
                  >
                    {muscle}
                    <button
                      type="button"
                      onClick={() => removeTargetMuscle(mcule)}
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
          </section>

          {/* Exercises Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 ${darkMode ? 'bg-purple-900' : 'bg-purple-100'} rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">Exercises</h2>
            </div>
            
            {formData.exercises.length > 0 ? (
              <div className="space-y-4">
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className={`${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200`}>
                    {editingExerciseIndex === index ? (
                      <div>
                        <h3 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 flex items-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                          </svg>
                          Edit Exercise
                        </h3>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exercise Name*</label>
                          <input
                            type="text"
                            name="name"
                            value={editingExercise.name}
                            onChange={handleEditingExerciseInputChange}
                            onKeyPress={allowOnlyLetters}
                            className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                            placeholder="e.g., Squats, Push-ups, Planks"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sets</label>
                            <input
                              type="number"
                              name="sets"
                              value={editingExercise.sets}
                              onChange={handleEditingExerciseInputChange}
                              min="1"
                              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Reps or Duration</label>
                            <div className="flex space-x-2">
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="reps"
                                  value={editingExercise.reps}
                                  onChange={handleEditingExerciseInputChange}
                                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                  placeholder="8-12"
                                />
                                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>For counted exercises</p>
                              </div>
                              <span className={`self-center mx-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>OR</span>
                              <div className="w-full">
                                <input
                                  type="text"
                                  name="duration"
                                  value={editingExercise.duration}
                                  onChange={handleEditingExerciseInputChange}
                                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                                  placeholder="30 sec"
                                />
                                <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>For timed exercises</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={saveEditedExercise}
                            disabled={!editingExercise.name.trim()}
                            className={`flex-1 py-3 px-4 rounded-lg border transition duration-200 ${darkMode ? 'bg-purple-900 border-purple-700 text-purple-300 hover:bg-purple-800' : 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200'} disabled:opacity-50`}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingExercise}
                            className={`flex-1 py-3 px-4 rounded-lg border transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className={`${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'} font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-3`}>
                              {index + 1}
                            </div>
                            <h3 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{exercise.name}</h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => startEditingExercise(index)}
                              className={`${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-500 hover:text-purple-700'} flex items-center transition duration-200`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExercise(index)}
                              className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} flex items-center transition duration-200`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className={`grid grid-cols-2 gap-4 mt-4 text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} p-3 rounded-lg`}>
                          <div>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Sets:</span>
                            <span className="ml-2 font-medium">{exercise.sets}</span>
                          </div>
                          <div>
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {exercise.duration ? 'Duration:' : 'Reps:'}
                            </span>
                            <span className="ml-2 font-medium">{exercise.duration || exercise.reps}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border border-dashed rounded-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905A3.61 3.61 0 008.5 5.5V14M5 18h8.5l4.5 3v-3h1a2 2 0 002-2v-4.5a2 2 0 00-2-2H5a2 2 0 00-2 2V16a2 2 0 002 2z" />
                </svg>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No exercises added yet</p>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Add your first exercise using the form below</p>
              </div>
            )}

            <div className={`${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6 shadow-sm mt-6`}>
              <h3 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-800'} mb-4 flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Exercise
              </h3>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exercise Name*</label>
                <input
                  type="text"
                  name="name"
                  value={newExercise.name}
                  onChange={handleExerciseInputChange}
                  onKeyPress={allowOnlyLetters}
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="e.g., Squats, Push-ups, Planks"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sets</label>
                  <input
                    type="number"
                    name="sets"
                    value={newExercise.sets}
                    onChange={handleExerciseInputChange}
                    min="1"
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Reps or Duration</label>
                  <div className="flex space-x-2">
                    <div className="w-full">
                      <input
                        type="text"
                        name="reps"
                        value={newExercise.reps}
                        onChange={handleExerciseInputChange}
                        className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder="8-12"
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>For counted exercises</p>
                    </div>
                    <span className={`self-center mx-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>OR</span>
                    <div className="w-full">
                      <input
                        type="text"
                        name="duration"
                        value={newExercise.duration}
                        onChange={handleExerciseInputChange}
                        className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        placeholder="30 sec"
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>For timed exercises</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={addExercise}
                disabled={!newExercise.name.trim()}
                className={`flex items-center justify-center w-full py-3 px-4 rounded-lg border transition duration-200 ${darkMode ? 'bg-purple-900 border-purple-700 text-purple-300 hover:bg-purple-800' : 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200'} disabled:opacity-50`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Exercise
              </button>
            </div>
          </section>

          {/* Submit Button */}
          <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                className={`w-full py-4 px-6 text-lg font-medium rounded-lg focus:outline-none focus:ring-4 transition duration-300 shadow-md ${darkMode ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-800' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-300 text-white'}`}
              >
                {id ? 'Update Workout Plan' : 'Create Workout Plan'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/workout-plans')}
                className={`w-full py-3 px-6 text-base font-medium rounded-lg border transition duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                Cancel
              </button>
            </div>
            
            {!id && (
              <p className={`text-sm mt-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Your workout plan will be saved to your profile and can be edited later.
              </p>
            )}
          </div>
        </form>
      </div>
      
      {/* Helpful Tips Section */}
      <div className="max-w-3xl mx-auto mt-8 p-6 bg-purple-900 rounded-xl border border-purple-800">
        <div className="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-purple-200">Helpful Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-purple-200">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Be specific with exercise names to avoid confusion</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>For timed exercises (like planks), use the duration field instead of reps</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Use rep ranges (e.g., "8-12") for progressive overload</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreateEditWorkoutPlan;