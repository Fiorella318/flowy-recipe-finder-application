import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChefHat } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
              <img 
                src="/assets/generated/chef-hat-icon.png" 
                alt="Chef Hat" 
                className="w-7 h-7 object-contain"
              />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Welcome to Flowy
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-full flex items-center justify-center mx-auto">
              <ChefHat className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            
            <DialogDescription className="text-lg text-center leading-relaxed">
              Hello, this is Flowy. I'm designed to help you with your cooking tasks.
            </DialogDescription>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground text-center mb-6">
                Discover delicious recipes based on your available ingredients, taste preferences, and cooking time.
              </p>
              
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
