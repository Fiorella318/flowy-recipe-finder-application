import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowLeft, ChefHat, Sparkles } from 'lucide-react';
import PremiumModal from './PremiumModal';
import type { Recipe, SearchPreferences } from '../App';

interface RecipeResultsProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  onBackToSearch: () => void;
  searchPreferences: SearchPreferences;
}

export default function RecipeResults({ 
  recipes, 
  onRecipeSelect, 
  onBackToSearch, 
  searchPreferences 
}: RecipeResultsProps) {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={onBackToSearch}
          className="border-orange-200 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Search
        </Button>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recipe Suggestions
          </h2>
          <p className="text-muted-foreground">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} with high ingredient match
          </p>
        </div>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Search Summary */}
      <Card className="mb-8 border-orange-200 dark:border-orange-800">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Your ingredients:</span>
              <div className="flex flex-wrap gap-1">
                {searchPreferences.ingredients.slice(0, 3).map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {ingredient.name}
                    {ingredient.quantity && ` (${ingredient.quantity})`}
                  </Badge>
                ))}
                {searchPreferences.ingredients.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{searchPreferences.ingredients.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            {searchPreferences.tastePreference && (
              <div className="flex items-center space-x-2">
                <span className="font-medium">Taste:</span>
                <Badge variant="secondary" className="text-xs">
                  {searchPreferences.tastePreference === 'salty' ? '🧂 Salty' : '🍯 Sweet'}
                </Badge>
              </div>
            )}
            {searchPreferences.timeAvailable && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Max time:</span>
                <Badge variant="outline" className="text-xs">
                  {searchPreferences.timeAvailable} min
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recipe Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => (
          <Card 
            key={index} 
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-orange-200 dark:border-orange-800"
            onClick={() => onRecipeSelect(recipe)}
          >
            <div className="aspect-video relative overflow-hidden rounded-t-lg">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=food`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Match Score - Always 90% or higher */}
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={recipe.matchScore === 100 ? "default" : "secondary"} 
                  className={`text-xs ${recipe.matchScore === 100 ? 'bg-green-500 hover:bg-green-600' : ''}`}
                >
                  {recipe.matchScore || 90}% match
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-orange-600 transition-colors">
                {recipe.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookingTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings || 4} servings</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onRecipeSelect(recipe);
                }}
              >
                View Recipe
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Premium Button */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPremiumModalOpen(true)}
          className="border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-950 text-orange-600 dark:text-orange-400"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Premium
        </Button>
      </div>

      {/* Premium Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
    </div>
  );
}
