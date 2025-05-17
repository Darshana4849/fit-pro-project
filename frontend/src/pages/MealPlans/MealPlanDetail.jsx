import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMealPlanById } from '../../services/mealPlanService';


// MealPlanDetail component displays detailed information about a specific meal plan
const MealPlanDetail = () => {
  // Get the meal plan ID from URL parameters
  const { id } = useParams();

  // State management for meal plan data, loading status, and errors
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meal plan data when component mounts or ID changes
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        // Call service to get meal plan by ID
        const plan = await getMealPlanById(id);
        setMealPlan(plan); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMealPlan();
  }, [id]);

   // Loading state UI - shows a spinner
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Error: {error}
    </div>
  );

  if (!mealPlan) return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      Meal plan not found
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{mealPlan.title}</h1>
          <p className="text-gray-500 mt-1">
            Created by {mealPlan.userName} • {mealPlan.dietType} • {mealPlan.durationDays} days
          </p>
        </div>
        
        {user && user.id === mealPlan.userId && (
          <Link
            to={`/meal-plans/edit/${id}`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Edit Plan
          </Link>
        )}
      </div>

      {mealPlan.description && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700">{mealPlan.description}</p>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Meals</h2>
        <div className="space-y-6">
          {mealPlan.meals.map((meal, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-lg text-purple-800">
                  {meal.timeOfDay}: {meal.name}
                </h3>
                <p className="text-sm text-purple-600">{meal.calories} calories</p>
              </div>
              
              <div className="p-4">
                {meal.description && (
                  <p className="text-gray-600 mb-4">{meal.description}</p>
                )}

                {meal.ingredients.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Ingredients</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {meal.ingredients.map((ingredient, i) => (
                        <li key={i} className="text-gray-600">
                          <span className="font-medium">{ingredient.name}</span> ({ingredient.amount})
                          {ingredient.notes && ` - ${ingredient.notes}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {mealPlan.isPublic ? (
            <span className="text-green-600">Public Plan</span>
          ) : (
            <span className="text-gray-600">Private Plan</span>
          )}
          {' • '}
          Created on {new Date(mealPlan.createdAt).toLocaleDateString()}
        </div>
        
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