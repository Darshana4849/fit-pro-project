import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMealPlanById } from '../../services/mealPlanService';

/**
 * MealPlanDetail component displays detailed information about a specific meal plan
 * including its meals, ingredients, and preparation instructions.
 */
const MealPlanDetail = () => {
  // Get the meal plan ID from URL parameters using react-router's useParams hook
  const { id } = useParams();

  // State management:
  // - mealPlan: Stores the fetched meal plan data
  // - loading: Tracks whether data is being fetched
  // - error: Stores any error that occurs during fetching
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch meal plan data when component mounts or ID changes
  useEffect(() => {
    // Async function to fetch meal plan data
    const fetchMealPlan = async () => {
      
    };
    fetchMealPlan();
  }, [id]); // Dependency array ensures effect runs when ID changes

  // Loading state UI - shows a spinner animation
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Error state UI - shows error message in a styled alert box
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Error: {error}
    </div>
  );

  // No meal plan found state UI - shows warning message
  if (!mealPlan) return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      Meal plan not found
    </div>
  );

  // Main render when data is successfully loaded
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section with title and metadata */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{mealPlan.title}</h1>
          <p className="text-gray-500 mt-1">
            Created by {mealPlan.userName} • {mealPlan.dietType} • {mealPlan.durationDays} days
          </p>
        </div>
        
        {/* Edit button (only shown if current user is the plan creator) */}
        {user && user.id === mealPlan.userId && (
          <Link
            to={`/meal-plans/edit/${id}`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Edit Plan
          </Link>
        )}
      </div>

      {/* Description section (shown if description exists) */}
      {mealPlan.description && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700">{mealPlan.description}</p>
        </div>
      )}

      {/* Meals section - displays all meals in the plan */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Meals</h2>
        <div className="space-y-6">
          {/* Map through each meal in the meal plan */}
          {mealPlan.meals.map((meal, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Meal header with time and name */}
              <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-lg text-purple-800">
                  {meal.timeOfDay}: {meal.name}
                </h3>
                <p className="text-sm text-purple-600">{meal.calories} calories</p>
              </div>
              
              {/* Meal details section */}
              <div className="p-4">
                {/* Meal description (if exists) */}
                {meal.description && (
                  <p className="text-gray-600 mb-4">{meal.description}</p>
                )}

                {/* Ingredients list (if ingredients exist) */}
                {meal.ingredients.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {/* Map through each ingredient */}
                      {meal.ingredients.map((ingredient, i) => (
                        <li key={i} className="text-gray-600">
                          <span className="font-medium">{ingredient.name}</span> ({ingredient.amount})
                          {ingredient.notes && ` - ${ingredient.notes}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preparation instructions (if exists) */}
                {meal.preparation && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Preparation</h4>
                    <p className="text-gray-600 whitespace-pre-line">{meal.preparation}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer section with metadata and back button */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {/* Display privacy status */}
          {mealPlan.isPublic ? (
            <span className="text-green-600">Public Plan</span>
          ) : (
            <span className="text-gray-600">Private Plan</span>
          )}
          {' • '}
          {/* Display creation date */}
          Created on {new Date(mealPlan.createdAt).toLocaleDateString()}
        </div>
        
        {/* Back button to return to meal plans list */}
        <Link
          to="/meal-plans"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Meal Plans
        </Link>
      </div>
    </div>
  );
};

export default MealPlanDetail;