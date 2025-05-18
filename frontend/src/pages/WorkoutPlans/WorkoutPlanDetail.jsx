import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWorkoutPlanById } from '../../services/workoutPlanService';

const WorkoutPlanDetail = () => {
  // Get the workout plan ID from URL parameters in details
  const { id } = useParams();
  
  // State for storing the workout plan data
  const [workoutPlan, setWorkoutPlan] = useState(null);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);

  // Fetch workout plan data when component mounts or ID changes
  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        setLoading(true);
        // Call service to get workout plan by ID
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

  // Helper function to get SVG icon based on workout type
  const getWorkoutTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'strength':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case 'cardio':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'flexibility':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
    }
  };

  // Helper function to get Tailwind classes based on difficulty level
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  // Return null if no workout plan data is available
  if (!workoutPlan) return null;

  // Main component render
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section with back button and action buttons */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/workout-plans" className="text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Workout Plans
          </Link>
        </div>
        <div className="flex space-x-4">
          {/* Edit button */}
          <Link
            to={`/workout-plans/${id}/edit`}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Link>
          
          {/* Start workout button */}
          <Link
            to={`/workout-plans/${id}/execute`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start This Plan
          </Link>
        </div>
      </div>

      {/* Main workout plan details card */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Plan header with title and metadata */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-2xl font-bold text-gray-900">{workoutPlan.title}</h1>
            <div className="mt-2 sm:mt-0 flex items-center space-x-2">
              {/* Difficulty badge */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(workoutPlan.difficulty)}`}>
                {workoutPlan.difficulty}
              </span>
              {/* Duration badge */}
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {workoutPlan.durationMinutes} mins
              </span>
              {/* Workout type badge */}
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center">
                {getWorkoutTypeIcon(workoutPlan.workoutType)} 
                <span className="ml-1">{workoutPlan.workoutType || 'Strength'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Plan description and target muscles */}
        <div className="px-6 py-4">
          <p className="text-gray-700">
            {workoutPlan.description || 'No description available.'}
          </p>
          
          {/* Target muscles section */}
          {workoutPlan.targetMuscles && workoutPlan.targetMuscles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Target Muscles:</h3>
              <div className="flex flex-wrap gap-2">
                {workoutPlan.targetMuscles.map((muscle, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exercises section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Exercises:</h2>
          
          <div className="space-y-6">
            {/* Check if there are exercises */}
            {workoutPlan.exercises && workoutPlan.exercises.length > 0 ? (
              // Map through exercises
              workoutPlan.exercises.map((exercise, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{exercise.name}</h3>
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      {/* Display sets if available */}
                      {exercise.sets && (
                        <span className="mr-4">
                          <span className="font-medium">{exercise.sets}</span> sets
                        </span>
                      )}
                      {/* Display reps if available */}
                      {exercise.reps && (
                        <span className="mr-4">
                          <span className="font-medium">{exercise.reps}</span> reps
                        </span>
                      )}
                      {/* Display duration if available */}
                      {exercise.duration && (
                        <span>
                          <span className="font-medium">{exercise.duration}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Empty state for no exercises
              <div className="text-center py-8 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="mt-2">No exercises added to this workout plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDetail;