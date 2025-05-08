package com.acumenbridge.acumenbridge.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "mealPlans")
public class MealPlan {
    @Id
    private String id;
    
    private String userId;       // who created the plan
    private String userName;     // display name of the creator
    
    private String title;
    private String description;
    private String dietType;     // e.g., Vegan, Keto, Mediterranean
    private int durationDays;
    private List<Meal> meals = new ArrayList<>();
    private boolean isPublic;
    
    private Instant createdAt;
    private Instant updatedAt;

    // Nested Meal class
    public static class Meal {
        private String name;
        private String description;
        private String timeOfDay; // Breakfast, Lunch, Dinner, Snack
        private List<Ingredient> ingredients = new ArrayList<>();
        private String preparation;
        private int calories;
        
        public Meal() {}
        
        public Meal(String name, String description, String timeOfDay, String preparation, int calories) {
            this.name = name;
            this.description = description;
            this.timeOfDay = timeOfDay;
            this.preparation = preparation;
            this.calories = calories;
        }

        // Getters and setters
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

    // Nested Ingredient class
    public static class Ingredient {
        private String name;
        private String amount;
        private String notes;
        
        public Ingredient() {}
        
        public Ingredient(String name, String amount, String notes) {
            this.name = name;
            this.amount = amount;
            this.notes = notes;
        }

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    // Constructors
    public MealPlan() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    // Getters and setters
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