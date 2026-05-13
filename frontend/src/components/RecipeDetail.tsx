import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Clock, Users, ChefHat, List } from 'lucide-react';
import type { Recipe } from '../App';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onBackToSearch: () => void;
}

export default function RecipeDetail({ recipe, onBack, onBackToSearch }: RecipeDetailProps) {
  const formatInstructions = (instructions: string) => {
    // Split instructions into steps
    const steps = instructions.split(/(?:\d+\.|\n)/).filter(step => step.trim().length > 0);
    return steps.map(step => step.trim()).filter(step => step.length > 10);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-orange-200 hover:bg-orange-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        <Button 
          variant="ghost" 
          onClick={onBackToSearch}
          className="text-muted-foreground hover:text-orange-600"
        >
          New Search
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recipe Image and Basic Info */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-orange-200 dark:border-orange-800">
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&crop=food`;
                }}
              />
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{recipe.cookingTime} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{recipe.servings || 4} servings</span>
                  </div>
                </div>
                
                {recipe.matchScore && (
                  <div>
                    <h3 className="font-semibold mb-2">Match Score</h3>
                    <Badge variant="outline" className="text-sm">
                      {recipe.matchScore}% match with your preferences
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {recipe.title}
            </h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Badge variant="outline" className="border-orange-200">
                <ChefHat className="w-3 h-3 mr-1" />
                Recipe
              </Badge>
              <span className="text-sm">Ready in {recipe.cookingTime} minutes</span>
            </div>
          </div>

          {/* Ingredients */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <List className="w-5 h-5" />
                <span>Ingredients</span>
              </CardTitle>
              <CardDescription>
                Everything you'll need for this recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-orange-100 dark:border-orange-800 last:border-b-0">
                    <span className="font-medium">{ingredient.name}</span>
                    {ingredient.quantity && (
                      <span className="text-muted-foreground text-sm">
                        {ingredient.quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5" />
                <span>Instructions</span>
              </CardTitle>
              <CardDescription>
                Step-by-step cooking instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {formatInstructions(recipe.instructions).map((step, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
