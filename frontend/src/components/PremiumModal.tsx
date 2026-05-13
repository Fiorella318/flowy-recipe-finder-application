import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Heart, Sparkles, ChefHat, X, Plus, CheckCircle } from 'lucide-react';
import { useRegisterForUpdates } from '../hooks/useQueries';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  
  const registerMutation = useRegisterForUpdates();

  const premiumFeatures = [
    {
      icon: Camera,
      title: "Ingredient Recognition by Image",
      description: "Simply take a photo of your ingredients and our AI will automatically identify them for you.",
      badge: "AI Powered"
    },
    {
      icon: Heart,
      title: "Track Favorite Meals",
      description: "Save your favorite recipes and create personalized meal collections for easy access.",
      badge: "Personal"
    },
    {
      icon: Sparkles,
      title: "Super Healthy Food Recommendations",
      description: "Get personalized healthy recipe suggestions based on your available ingredients and dietary goals.",
      badge: "Health Focus"
    },
    {
      icon: ChefHat,
      title: "Choose Your Cooking Technique",
      description: "Filter recipes by specific cooking methods like steamed, fried, grilled, baked, and more.",
      badge: "Advanced"
    },
    {
      icon: Plus,
      title: "Enjoy More Than 3 Recipes",
      description: "Get access to unlimited recipe suggestions instead of being limited to just 3 results per search.",
      badge: "Unlimited"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await registerMutation.mutateAsync({ name: name.trim(), email: email.trim() });
      setIsRegistered(true);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setIsRegistered(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Premium Features
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-base">
            Unlock advanced features to enhance your recipe discovery experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-lg border border-orange-200 dark:border-orange-800">
          {!isRegistered ? (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Coming Soon!
                </h3>
                <p className="text-sm text-muted-foreground">
                  These premium features are currently in development and will be available soon.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    disabled={registerMutation.isPending || !name.trim() || !email.trim()}
                  >
                    {registerMutation.isPending ? 'Registering...' : 'Register to be the first to receive update news'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Thank You for Registering!
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We've received your registration and you'll be the first to know when these premium features become available.
              </p>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
