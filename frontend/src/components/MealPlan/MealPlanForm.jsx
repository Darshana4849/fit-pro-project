import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMealPlanById, createMealPlan, updateMealPlan } from '../../services/mealPlanService';

const MealPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dietType: 'Balanced',
    durationDays: 7,
    meals: [],
    isPublic: false,
  });
  const [newMeal, setNewMeal] = useState({
    name: '',
    description: '',
    timeOfDay: 'Breakfast',
    ingredients: [],
    preparation: '',
    calories: 500,
  });
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    amount: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchMealPlan = async () => {
        try {
          setLoading(true);
          const plan = await getMealPlanById(id);
          setFormData(plan);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMealPlan();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleMealInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal({
      ...newMeal,
      [name]: name === 'calories' ? parseInt(value) : value,
    });
  };

  const handleIngredientInputChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient({
      ...newIngredient,
      [name]: value,
    });
  };

  const addIngredient = () => {
    if (newIngredient.name.trim()) {
      setNewMeal({
        ...newMeal,
        ingredients: [...newMeal.ingredients, { ...newIngredient }],
      });
      setNewIngredient({
        name: '',
        amount: '',
        notes: ''
      });
    }
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...newMeal.ingredients];
    updatedIngredients.splice(index, 1);
    setNewMeal({
      ...newMeal,
      ingredients: updatedIngredients,
    });
  };

  const addMeal = () => {
    if (newMeal.name.trim()) {
      setFormData({
        ...formData,
        meals: [...formData.meals, { ...newMeal }],
      });
      setNewMeal({
        name: '',
        description: '',
        timeOfDay: 'Breakfast',
        ingredients: [],
        preparation: '',
        calories: 500,
      });
    }
  };

  const removeMeal = (index) => {
    const updatedMeals = [...formData.meals];
    updatedMeals.splice(index, 1);
    setFormData({
      ...formData,
      meals: updatedMeals,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await updateMealPlan(id, formData);
      } else {
        await createMealPlan(formData);
      }
      navigate('/meal-plans');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 mx-auto max-w-3xl mt-8">
      <p>Error: {error}</p>
      <button 
        onClick={() => setError(null)}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 text-gray-100">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">
            {id ? 'Edit Meal Plan' : 'Create New Meal Plan'}
          </h1>
          <button
            onClick={() => navigate('/meal-plans')}
            className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-300 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Diet Type*</label>
                <select
                  name="dietType"
                  value={formData.dietType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="Low-Carb">Low-Carb</option>
                  <option value="High-Protein">High-Protein</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Duration (days)*</label>
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* <div className="flex items-center justify-start pt-6">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="isPublic"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-indigo-600 bg-gray-700 border-gray-500 rounded focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isPublic" className="font-medium text-gray-300">
                    Make this plan public
                  </label>
                  <p className="text-gray-400">Others can view and use this plan</p>
                </div>
              </div> */}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Describe the purpose and goals of this meal plan..."
              />
            </div>
          </div>

          {/* Meals Section */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-300 mb-6">Meals</h2>
            
            {/* Add Meal Form */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
              <h3 className="font-medium text-purple-300 mb-4">Add New Meal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={newMeal.name}
                    onChange={handleMealInputChange}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Meal name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Time of Day*</label>
                  <select
                    name="timeOfDay"
                    value={newMeal.timeOfDay}
                    onChange={handleMealInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Calories*</label>
                  <input
                    type="number"
                    name="calories"
                    value={newMeal.calories}
                    onChange={handleMealInputChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    value={newMeal.description}
                    onChange={handleMealInputChange}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    placeholder="Brief description"
                  />
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-300 mb-2">Ingredients</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={newIngredient.name}
                      onChange={handleIngredientInputChange}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Ingredient name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Amount*</label>
                    <input
                      type="text"
                      name="amount"
                      value={newIngredient.amount}
                      onChange={handleIngredientInputChange}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="1 cup, 200g, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={newIngredient.notes}
                      onChange={handleIngredientInputChange}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Optional notes"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  disabled={!newIngredient.name.trim() || !newIngredient.amount.trim()}
                  className="flex items-center px-3 py-1 bg-purple-900 text-purple-200 rounded-lg hover:bg-purple-800 disabled:bg-gray-700 disabled:text-gray-500 transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Ingredient
                </button>

                {newMeal.ingredients.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {newMeal.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                        <span className="text-sm text-gray-200">
                          <span className="font-medium">{ingredient.name}</span> ({ingredient.amount})
                          {ingredient.notes && ` - ${ingredient.notes}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Preparation Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Preparation Instructions</label>
                <textarea
                  name="preparation"
                  value={newMeal.preparation}
                  onChange={handleMealInputChange}
                  rows="3"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Step-by-step instructions..."
                />
              </div>

              <button
                type="button"
                onClick={addMeal}
                disabled={!newMeal.name.trim() || newMeal.ingredients.length === 0}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Meal
              </button>
            </div>

            {/* Meals List */}
            <div className="space-y-4">
              {formData.meals.length > 0 ? (
                formData.meals.map((meal, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-lg text-gray-200">{meal.name}</h3>
                        <p className="text-sm text-purple-300">{meal.timeOfDay}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMeal(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {meal.description && (
                      <p className="text-gray-300 mb-3">{meal.description}</p>
                    )}

                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-300 mb-2">Ingredients</h4>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                        {meal.ingredients.map((ingredient, i) => (
                          <li key={i}>
                            <span className="font-medium">{ingredient.name}</span> ({ingredient.amount})
                            {ingredient.notes && ` - ${ingredient.notes}`}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {meal.preparation && (
                      <div className="mb-3">
                        <h4 className="font-medium text-sm text-gray-300 mb-2">Preparation</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-line">{meal.preparation}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300">
                        {meal.calories} calories
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="mt-2">No meals added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={() => navigate('/meal-plans')}
              className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {id ? 'Update Meal Plan' : 'Create Meal Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealPlanForm;