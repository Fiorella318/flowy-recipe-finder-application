import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Clock, ChefHat, Search, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';
import type { Ingredient, SearchPreferences } from '../App';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface RecipeSearchFormProps {
  onSearch: (preferences: SearchPreferences) => void;
  isSearching: boolean;
}

// Helper function to parse quantity and ingredient from speech
function parseIngredientFromSpeech(text: string): { ingredient: string; quantity?: string } {
  // Remove "I have" and clean up the text - ensure it's completely removed
  const cleanText = text
    .replace(/^i\s+have\s+/i, '')
    .replace(/^have\s+/i, '') // Also handle cases where "I" might be missed
    .replace(/\s+(please|thanks|thank you)$/i, '')
    .trim();

  // Patterns for quantity extraction
  const patterns = [
    // Numbers with units: "2 cups of flour", "1 liter of milk", "3 tablespoons of oil"
    /^(\d+(?:\.\d+)?)\s+(cups?|liters?|litres?|tablespoons?|teaspoons?|tbsp|tsp|pounds?|lbs?|ounces?|oz|grams?|g|kilograms?|kg|milliliters?|ml|pints?|quarts?|gallons?)\s+(?:of\s+)?(.+)$/i,
    
    // Fractions with units: "1/2 cup of sugar", "3/4 pound of beef"
    /^(\d+\/\d+)\s+(cups?|liters?|litres?|tablespoons?|teaspoons?|tbsp|tsp|pounds?|lbs?|ounces?|oz|grams?|g|kilograms?|kg|milliliters?|ml|pints?|quarts?|gallons?)\s+(?:of\s+)?(.+)$/i,
    
    // Mixed numbers: "1 1/2 cups of flour"
    /^(\d+\s+\d+\/\d+)\s+(cups?|liters?|litres?|tablespoons?|teaspoons?|tbsp|tsp|pounds?|lbs?|ounces?|oz|grams?|g|kilograms?|kg|milliliters?|ml|pints?|quarts?|gallons?)\s+(?:of\s+)?(.+)$/i,
    
    // Simple numbers: "4 eggs", "2 apples", "5 carrots"
    /^(\d+(?:\.\d+)?)\s+(.+)$/i,
    
    // Fractions alone: "1/2 onion", "3/4 chicken"
    /^(\d+\/\d+)\s+(.+)$/i,
    
    // Mixed numbers alone: "1 1/2 onions"
    /^(\d+\s+\d+\/\d+)\s+(.+)$/i,
    
    // Descriptive quantities: "a cup of flour", "some salt", "a pinch of pepper"
    /^(a|an|some|a\s+(?:cup|liter|litre|tablespoon|teaspoon|tbsp|tsp|pound|lb|ounce|oz|gram|g|kilogram|kg|milliliter|ml|pint|quart|gallon|pinch|dash|handful)(?:\s+of)?)\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = cleanText.match(pattern);
    if (match) {
      if (pattern === patterns[0] || pattern === patterns[1] || pattern === patterns[2]) {
        // Patterns with explicit units
        const quantity = match[1];
        const unit = match[2];
        const ingredient = match[3];
        return {
          ingredient: cleanIngredientName(ingredient),
          quantity: `${quantity} ${unit}`.trim()
        };
      } else if (pattern === patterns[3] || pattern === patterns[4] || pattern === patterns[5]) {
        // Simple number patterns
        const quantity = match[1];
        const ingredient = match[2];
        return {
          ingredient: cleanIngredientName(ingredient),
          quantity: quantity.trim()
        };
      } else if (pattern === patterns[6]) {
        // Descriptive quantities
        const quantity = match[1];
        const ingredient = match[2];
        return {
          ingredient: cleanIngredientName(ingredient),
          quantity: quantity.trim()
        };
      }
    }
  }

  // If no quantity pattern matches, treat the whole thing as an ingredient
  return {
    ingredient: cleanIngredientName(cleanText)
  };
}

// Helper function to clean ingredient names
function cleanIngredientName(ingredient: string): string {
  return ingredient
    .replace(/^(some|a|an|the)\s+/i, '') // Remove articles
    .replace(/\s+(please|thanks|thank you)$/i, '') // Remove politeness words
    .trim();
}

export default function RecipeSearchForm({ onSearch, isSearching }: RecipeSearchFormProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [tastePreference, setTastePreference] = useState<'salty' | 'sweet' | ''>('');
  const [additionalPreferences, setAdditionalPreferences] = useState('');
  const [timeAvailable, setTimeAvailable] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        
        // Look for "I have" pattern and extract ingredients with quantities
        if (transcript.includes('i have') || transcript.includes('have')) {
          const parsed = parseIngredientFromSpeech(transcript);
          
          if (parsed.ingredient && parsed.ingredient.length > 0) {
            // Ensure "I have" is not part of the ingredient name
            const cleanedIngredient = parsed.ingredient.replace(/^i\s+have\s+/i, '').trim();
            
            if (cleanedIngredient.length > 0) {
              // Add the ingredient with extracted quantity
              const newIngredient: Ingredient = {
                name: cleanedIngredient,
                quantity: parsed.quantity,
              };
              
              setIngredients(prev => [...prev, newIngredient]);
              
              // Show success message with quantity info
              const quantityText = parsed.quantity ? ` (${parsed.quantity})` : '';
              toast.success(`Added ingredient: ${cleanedIngredient}${quantityText}`);
            } else {
              toast.error('Could not understand the ingredient. Please try again.');
            }
          } else {
            toast.error('Could not understand the ingredient. Please try again.');
          }
        } else {
          toast.error('Please say "I have..." followed by the ingredient name and optional quantity');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        switch (event.error) {
          case 'no-speech':
            toast.error('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            toast.error('Microphone not accessible. Please check permissions.');
            break;
          case 'not-allowed':
            toast.error('Microphone permission denied. Please allow microphone access.');
            break;
          default:
            toast.error('Speech recognition error. Please try again.');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const addIngredient = () => {
    if (!currentIngredient.trim()) {
      toast.error('Please enter an ingredient name');
      return;
    }

    const newIngredient: Ingredient = {
      name: currentIngredient.trim(),
      quantity: currentQuantity.trim() || undefined,
    };

    setIngredients([...ingredients, newIngredient]);
    setCurrentIngredient('');
    setCurrentQuantity('');
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        toast.info('Listening... Say "I have" followed by ingredient name. You can say quantities if you want, but it\'s optional!');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Could not start voice input. Please try again.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    const preferences: SearchPreferences = {
      ingredients,
      tastePreference,
      additionalPreferences,
      timeAvailable: timeAvailable === 'undefined' ? undefined : parseInt(timeAvailable) || undefined,
    };

    onSearch(preferences);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <ChefHat className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What's in your kitchen?
        </h2>
        <p className="text-lg text-muted-foreground">
          Tell us what ingredients you have and we'll find the perfect recipes for you
        </p>
      </div>

      <Card className="shadow-lg border-orange-200 dark:border-orange-800">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 text-center">
          <CardTitle className="flex items-center justify-center text-xl">
            <span>Recipe Search</span>
            <Search className="w-5 h-5 ml-2" />
          </CardTitle>
          <CardDescription className="text-center">
            Add your ingredients and preferences to discover delicious recipes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ingredients Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Available Ingredients</Label>
              
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    placeholder="Enter ingredient (e.g., chicken, tomatoes)"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <div className="w-32">
                  <Input
                    placeholder="Quantity"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={addIngredient}
                  size="icon"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                {speechSupported && (
                  <Button
                    type="button"
                    onClick={toggleVoiceInput}
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className={isListening ? "animate-pulse" : "border-orange-200 hover:border-orange-400"}
                    title={isListening ? "Stop voice input" : "Start voice input - say 'I have...'"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {speechSupported && (
                <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <span>
                      <strong>Enhanced Voice Input:</strong> Click the microphone and say "I have..." followed by ingredient names
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                    📝 <strong>You can say quantities if you want, but it's optional!</strong>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <div><strong>With quantities:</strong> "I have 4 eggs" or "I have 1 cup of flour"</div>
                    <div><strong>Without quantities:</strong> "I have eggs" or "I have flour"</div>
                    <div>Both work perfectly - choose what's easier for you!</div>
                  </div>
                  {isListening && (
                    <div className="mt-2 text-blue-600 dark:text-blue-400 font-medium">
                      🎤 Listening... Say "I have [ingredient]" (quantities optional)
                    </div>
                  )}
                </div>
              )}

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  {ingredients.map((ingredient, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 px-3 py-1"
                    >
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.quantity && (
                        <span className="text-muted-foreground ml-1">({ingredient.quantity})</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="ml-2 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Taste Preference */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Taste Preference</Label>
              <ToggleGroup 
                type="single" 
                value={tastePreference} 
                onValueChange={(value) => setTastePreference(value as 'salty' | 'sweet' | '')}
                className="justify-start"
              >
                <ToggleGroupItem 
                  value="salty" 
                  className="data-[state=on]:bg-orange-500 data-[state=on]:text-white"
                >
                  🧂 Salty
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="sweet"
                  className="data-[state=on]:bg-orange-500 data-[state=on]:text-white"
                >
                  🍯 Sweet
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Additional Preferences */}
            <div className="space-y-3">
              <Label htmlFor="additional-preferences" className="text-base font-semibold">
                Additional Preferences
              </Label>
              <Textarea
                id="additional-preferences"
                placeholder="e.g., liquid, crunchy, fluffy, crispy, spicy, vegetarian, gluten-free..."
                value={additionalPreferences}
                onChange={(e) => setAdditionalPreferences(e.target.value)}
                className="border-orange-200 focus:border-orange-400 min-h-[80px]"
              />
              <div className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Try descriptive terms like "liquid" (for soups, juices), "crunchy" (for fried foods, cookies), or "fluffy" (for cakes, pancakes)
              </div>
            </div>

            {/* Time Available */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Time Available</span>
              </Label>
              <Select value={timeAvailable} onValueChange={setTimeAvailable}>
                <SelectTrigger className="border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Select cooking time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="undefined">No time limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 text-lg"
              disabled={isSearching || ingredients.length === 0}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Searching for recipes...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Find Recipes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
