package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * MealPlan Model
 * 
 * Represents a meal plan entity in the system, containing:
 * - Basic plan information (title, description, diet type)
 * - List of meals with their details
 * - Creator information
 * - Visibility settings
 * - Timestamps for creation and modification
 */
@Document(collection = "mealPlans") // Specifies the MongoDB collection name
public class MealPlan {
    @Id // Marks this field as the document identifier
    private String id; // Unique identifier for the meal plan
    
    private String userId;       // ID of the user who created the plan
    private String userName;     // Display name of the creator
    
    private String title;        // Title of the meal plan
    private String description;  // Description of the meal plan
    private String dietType;     // Type of diet (e.g., Vegan, Keto, Mediterranean)
    private int durationDays;    // Duration of the plan in days
    private List<Meal> meals = new ArrayList<>(); // List of meals in the plan
    private boolean isPublic;    // Visibility setting for the plan
    
    private Instant createdAt;   // Timestamp when plan was created
    private Instant updatedAt;   // Timestamp when plan was last updated

    /**
     * Nested Meal class representing individual meals within a plan
     */
    public static class Meal {
        private String name;            // Name of the meal
        private String description;     // Description of the meal
        private String timeOfDay;       // When the meal is consumed (Breakfast, Lunch, Dinner, Snack)
        private List<Ingredient> ingredients = new ArrayList<>(); // List of ingredients
        private String preparation;     // Preparation instructions
        private int calories;           // Calorie count
        
        public Meal() {}
        
        /**
         * Constructor for creating a new Meal with basic information
         */
        public Meal(String name, String description, String timeOfDay, String preparation, int calories) {
            this.name = name;
            this.description = description;
            this.timeOfDay = timeOfDay;
            this.preparation = preparation;
            this.calories = calories;
        }

        // Standard getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getTimeOfDay() { return timeOfDay; }
        public void setTimeOfDay(String timeOfDay) { this.timeOfDay = timeOfDay; }
        public List<Ingredient> getIngredients() { return ingredients; }
        public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }
        public String getPreparation() { return preparation; }
        public void setPreparation(String preparation) { this.preparation = preparation; }
        public int getCalories() { return calories; }
        public void setCalories(int calories) { this.calories = calories; }
    }

    /**
     * Nested Ingredient class representing ingredients within a meal
     */
    public static class Ingredient {
        private String name;    // Name of the ingredient
        private String amount;  // Required amount
        private String notes;  // Additional notes about the ingredient
        
        public Ingredient() {}
        
        /**
         * Constructor for creating a new Ingredient
         */
        public Ingredient(String name, String amount, String notes) {
            this.name = name;
            this.amount = amount;
            this.notes = notes;
        }

        // Standard getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    /**
     * Default constructor initializes timestamps
     */
    public MealPlan() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // --------------------------------------
    // Standard Getters and Setters
    // --------------------------------------

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDietType() { return dietType; }
    public void setDietType(String dietType) { this.dietType = dietType; }
    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }
    public List<Meal> getMeals() { return meals; }
    public void setMeals(List<Meal> meals) { this.meals = meals; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}