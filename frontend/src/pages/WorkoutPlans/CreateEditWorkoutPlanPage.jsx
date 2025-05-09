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
    durationWeeks: 4,
    focusArea: 'Strength',
    exercises: [],
    isPublic: false,
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: '8-12',
    duration: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const addExercise = () => {
    if (newExercise.name.trim()) {
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
  };

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

  if (loading) return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        <p className="mt-4 text-purple-400 font-medium">Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-red-900 border-l-4 border-red-500 rounded-lg shadow-md text-red-100">
      <div className="flex items-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-red-200">Something went wrong</h3>
      </div>
      <p className="text-red-200 mb-4">{error}</p>
      <div className="flex space-x-3">
        <button 
          onClick={() => setError(null)}
          className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 shadow-sm"
        >
          Try Again
        </button>
        <button 
          onClick={() => navigate('/workout-plans')}
          className="px-5 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-700 transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen py-12 text-gray-100">
      <div className="max-w-3xl mx-auto px-6 bg-gray-800 rounded-xl shadow-lg">
        <div className="pt-10 pb-6 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">
            {id ? 'Edit Workout Plan' : 'Create Workout Plan'}
          </h1>
          <p className="text-purple-400 font-medium">
            {id ? 'Update your existing workout plan' : 'Design your perfect fitness journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="py-8 space-y-10">
          {/* Basic Information Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-900 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-100">Basic Information</h2>
            </div>
            
            <div className="bg-gray-850 p-6 rounded-xl shadow-sm border border-gray-700">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Plan Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white placeholder-gray-400"
                  placeholder="e.g., Beginner Full Body Workout"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level*</label>
                <div className="flex flex-wrap gap-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <label key={level} className={`flex items-center px-4 py-2 rounded-lg border ${formData.difficulty === level ? 'bg-purple-900 border-purple-500 ring-2 ring-purple-700' : 'border-gray-600 hover:bg-gray-700'} cursor-pointer transition duration-200`}>
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={formData.difficulty === level}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 hidden"
                      />
                      <span className={`text-base ${formData.difficulty === level ? 'text-purple-300 font-medium' : 'text-gray-300'}`}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration (weeks)*</label>
                  <input
                    type="number"
                    name="durationWeeks"
                    value={formData.durationWeeks}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white"
                    placeholder="e.g., 4 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Focus Area*</label>
                  <select
                    name="focusArea"
                    value={formData.focusArea}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white"
                  >
                    {['Strength', 'Endurance', 'Hypertrophy', 'Flexibility', 'Cardio'].map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white placeholder-gray-400"
                  placeholder="Describe the workout plan, its benefits, and who it's for..."
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600 rounded"
                />
                <label htmlFor="isPublic" className="text-gray-300">Make this workout plan public</label>
              </div>
            </div>
          </section>

          {/* Exercises Section */}
          <section className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-900 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-100">Exercises</h2>
            </div>
            
            {formData.exercises.length > 0 ? (
              <div className="space-y-4">
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-750 border border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition duration-200">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="bg-purple-900 text-purple-300 font-semibold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <h3 className="font-medium text-lg text-gray-200">{exercise.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-400 hover:text-red-300 flex items-center transition duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm bg-gray-800 p-3 rounded-lg">
                      <div>
                        <span className="text-gray-400">Sets:</span>
                        <span className="ml-2 font-medium text-gray-300">{exercise.sets}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">
                          {exercise.duration ? 'Duration:' : 'Reps:'}
                        </span>
                        <span className="ml-2 font-medium text-gray-300">{exercise.duration || exercise.reps}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-800 border border-dashed border-gray-700 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905A3.61 3.61 0 008.5 5.5V14M5 18h8.5l4.5 3v-3h1a2 2 0 002-2v-4.5a2 2 0 00-2-2H5a2 2 0 00-2 2V16a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-gray-400">No exercises added yet</p>
                <p className="text-gray-500 text-sm">Add your first exercise using the form below</p>
              </div>
            )}

            <div className="bg-gray-750 border border-gray-700 rounded-lg p-6 shadow-sm mt-6">
              <h3 className="font-medium text-lg text-gray-200 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Exercise
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Exercise Name*</label>
                <input
                  type="text"
                  name="name"
                  value={newExercise.name}
                  onChange={handleExerciseInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white placeholder-gray-400"
                  placeholder="e.g., Squats, Push-ups, Planks"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Sets</label>
                  <input
                    type="number"
                    name="sets"
                    value={newExercise.sets}
                    onChange={handleExerciseInputChange}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Reps or Duration</label>
                  <div className="flex space-x-2">
                    <div className="w-full">
                      <input
                        type="text"
                        name="reps"
                        value={newExercise.reps}
                        onChange={handleExerciseInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white placeholder-gray-400"
                        placeholder="8-12"
                      />
                      <p className="mt-1 text-xs text-gray-400">For counted exercises</p>
                    </div>
                    <span className="self-center text-gray-400 mx-2">OR</span>
                    <div className="w-full">
                      <input
                        type="text"
                        name="duration"
                        value={newExercise.duration}
                        onChange={handleExerciseInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-white placeholder-gray-400"
                        placeholder="30 sec"
                      />
                      <p className="mt-1 text-xs text-gray-400">For timed exercises</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                onClick={addExercise}
                disabled={!newExercise.name.trim()}
                className="flex items-center justify-center w-full py-3 px-4 bg-purple-900 border border-purple-700 rounded-lg text-purple-300 hover:bg-purple-800 disabled:opacity-50 transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Exercise
              </button>
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-purple-600 text-white text-lg font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-800 transition duration-300 shadow-md"
              >
                {id ? 'Update Workout Plan' : 'Create Workout Plan'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/workout-plans')}
                className="w-full py-3 px-6 bg-gray-700 text-gray-300 text-base font-medium rounded-lg border border-gray-600 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
            
            {!id && (
              <p className="text-sm text-gray-400 mt-4 text-center">
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