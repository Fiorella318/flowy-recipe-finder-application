# Flowy Recipe Finder Application

## Overview
Flowy is a recipe discovery application that helps users find recipes based on their available ingredients, taste preferences, and time constraints.

## Core Features

### Welcome Modal
- A welcome modal automatically appears when users first open the webpage
- Modal displays a friendly greeting message: "Hello, this is Flowy. I'm designed to help you with your cooking tasks."
- Modal is visually appealing with proper styling and branding
- Users can easily dismiss the modal by clicking a single close button or clicking outside the modal
- Modal only shows once per session or on first visit to avoid repetitive interruptions
- Modal does not block critical functionality and can be dismissed immediately

### Ingredient Input
- Users can add ingredients they have available as labels/tags
- Optional quantity specification for each ingredient
- Ability to add and remove ingredients dynamically
- **Enhanced Voice Input Feature**: Users can dictate ingredients using voice input by saying "I have..." before each new ingredient
- **Optional Quantity Recognition**: Voice input can automatically recognize and extract both ingredient names and quantities/measurements when users optionally say phrases like "I have 4 eggs", "I have 1 liter of milk", or "I have 2 cups of flour" - **mentioning quantities in voice input is completely optional and users can simply say ingredient names without any measurements**
- **Clear Optional Quantity Guidance**: The interface clearly displays that users can say quantities if they want, but it's optional - making this guidance visible and easy to understand for users dictating ingredients
- **Clean Ingredient Processing**: The voice input system filters out the "I have" phrase and only processes the actual ingredient name and quantity, ensuring "I have" is never displayed as part of the ingredient name
- **Automatic Quantity Population**: When quantities are detected in voice input, they are automatically populated in the quantity input field for each ingredient, just as if typed manually
- Voice input works alongside existing text input - users can choose either method for entering ingredients
- Voice recognition processes spoken ingredients and adds them to the ingredient list with extracted quantities when provided

### Preference Selection
- Toggle buttons for taste preferences: "salty" or "sweet"
- Free text input field for additional preferences (e.g., "fluffy", "crispy", "spicy", "liquid", "crunchy")
- **Dominant Creative Preference System**: Additional preferences have primary influence over recipe selection, taking precedence over ingredient matching:
  - **Texture-based preferences**: "liquid" strongly prioritizes smoothies, juices, soups, broths, and liquid-based recipes; "crunchy" strongly prioritizes cookies, fried foods, nuts, crackers, and crispy textures; "fluffy" strongly prioritizes pancakes, cakes, soufflés, and airy textures; "crispy" strongly prioritizes fried items, roasted vegetables, chips, and crispy preparations
  - **Temperature preferences**: "hot" strongly prioritizes warm dishes, stews, grilled items; "cold" strongly prioritizes salads, ice cream, chilled soups, and cold preparations
  - **Cooking method preferences**: "fried" strongly prioritizes pan-fried or deep-fried recipes; "baked" strongly prioritizes oven-baked items; "grilled" strongly prioritizes barbecue and grilled recipes
  - **Flavor intensity**: "mild" strongly prioritizes subtle flavors; "spicy" strongly prioritizes hot and seasoned dishes; "rich" strongly prioritizes creamy, indulgent recipes
  - **Strict Taste Category Enforcement**: Creative mapping strictly respects the selected taste preference - sweet preferences exclusively map to dessert recipes (cakes, cookies, smoothies, juices, ice cream, pastries), salty preferences exclusively map to savory dishes (main dishes, breads, soups, salads, appetizers)
  - **Primary Preference Dominance**: Additional preferences are the primary search criteria that dominate recipe selection, ensuring the most relevant recipes are recommended (e.g., for "liquid" + "sweet" + strawberries/milk/sugar, prioritize smoothies and juices over solid desserts)

### Time Input
- Timer input field where users can specify available cooking time
- Option to select "undefined" for no time constraint

### Recipe Search
- Submit button to trigger recipe search based on user inputs
- Frontend makes HTTP calls to public recipe APIs and expanded recipe databases to find matching recipes
- **Enhanced Recipe Database Access**: Application searches through expanded recipe databases that include diverse recipe types to match creative and descriptive preferences for both sweet and salty selections
- Recipe matching algorithm that always displays exactly 3 recipe suggestions:
  - **Guaranteed 3 Results**: The application always displays exactly 3 recipe suggestions, never fewer
  - **Flexible Ingredient Matching**: Prioritizes recipes with higher ingredient match percentages, starting with 100% matches, then 90%+, but will relax requirements as needed to ensure 3 recipes are always displayed
  - **Adaptive Match Requirements**: If insufficient recipes meet the 90%+ ingredient match threshold, the system progressively relaxes the filter to fill all 3 slots while prioritizing recipes that use as many of the user's ingredients as possible
  - **Perfect Match Priority**: Recipes that use ALL provided ingredients are prioritized first to minimize food waste and maximize ingredient utilization
  - **Creative Alternative Inclusion**: When strict matches are insufficient, includes creative alternatives with partial matches but clearly indicates their match percentage
  - **Common Combination Optimization**: Prioritize recipes that use all or nearly all of the user's ingredients, especially for common combinations like "meat, garlic, butter, rice, salt"
  - **Preference-Dominant Matching**: Additional preferences are the primary filter that determines recipe selection, with ingredient matching as a secondary consideration
  - **Creative Preference Priority**: When additional preferences are specified, recipes that match these characteristics are prioritized as the main selection criteria, ensuring results directly reflect the user's described preferences (e.g., "liquid" + "sweet" prioritizes smoothies, juices, fruit drinks over solid desserts)
  - **Preference-Weighted Selection**: All 3 slots are filled with recipes that best match the additional preferences while maximizing ingredient utilization
  - **Strict Taste Category Filtering**: When "salty" is selected, exclusively show savory recipes (main dishes, breads, soups, salads, appetizers) and never include any dessert recipes. When "sweet" is selected, exclusively show dessert recipes (cakes, cookies, smoothies, juices, ice cream, pastries) and never include any savory dishes
  - **Expanded Recipe Variety**: Access to wider variety of recipes ensures relevant options are always available for both sweet and salty selections with creative preferences
  - **Flexible Matching**: Handles ingredient variations, plurals, and partial matches while maintaining preference-driven selection
  - **Match Information Display**: Recipes clearly show ingredient match percentages and preference alignment indicators
  - **No Blank Spaces**: System ensures 3 recipes are always displayed with no empty slots, using creative alternatives when necessary

### Recipe Display
- Show exactly 3 recipe cards with basic information (title, image, cooking time)
- Display ingredient match percentage and preference alignment indicators for each recipe
- Clickable recipe cards that expand to show full recipe details
- Full recipe view includes ingredients list, instructions, and cooking time

### Premium Features Access
- Small "Premium" button displayed below the recipe results
- Clicking the Premium button opens a page or modal showing premium features list
- Premium features displayed include:
  - Ingredient recognition by image
  - Tracking favorite meals
  - Recommending super healthy foods based on your ingredients
  - Choosing your cooking technique (steamed, fried, etc)
  - Enjoy more than 3 recipes
- Premium features are for display purposes only and do not need to be functional
- **Registration Form**: Instead of a "Got it, thanks!" button, the Premium modal includes a registration form with:
  - Name input field
  - Email input field
  - Submit button labeled "Register to be the first to receive update news"
  - After form submission, display a confirmation message thanking the user for registering

## User Interface
- Application header displays the Flowy brand name with a chef hat icon for a thematic cooking appearance
- **Centered Form Header**: The RecipeSearchForm displays a centered "Recipe Search" title with a search icon positioned to the right side of the heading, and "Add your ingredients and preferences to discover delicious recipes" description as a visually distinct presentation/introduction that appears non-interactive and non-clickable. The heading and search icon are visually grouped together as a cohesive unit.

## Data Storage
The backend stores user registration data (name and email) from the Premium modal registration form. All other user inputs and recipe searches are handled in the frontend session only.

## User Flow
1. User opens the webpage and is greeted by the welcome modal with Flowy's introduction message
2. User dismisses the welcome modal to access the main application
3. User enters available ingredients with optional quantities using either text input or enhanced voice input (by saying "I have..." before each ingredient, with optional quantity specification)
4. User selects taste preference (salty/sweet) and adds custom preferences that will have dominant influence on recipe suggestions
5. User sets available cooking time or selects undefined
6. User submits the form to search for recipes
7. Application displays exactly 3 recipe suggestions with adaptive ingredient matching - prioritizing higher match percentages but ensuring all 3 slots are filled even with creative alternatives, with preference matching as the primary selection criteria and clear match percentage indicators for each recipe
8. User clicks on a recipe to view full details
9. User can click the Premium button to view available premium features and register for updates by providing their name and email

## Language
The application content is displayed in English.
