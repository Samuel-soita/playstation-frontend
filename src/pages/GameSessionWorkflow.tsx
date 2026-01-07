import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GameSessionWorkflow } from '@/components/GameSessionWorkflow';
import { ImageBackground } from '@/components/ImageBackground';

export const GameSessionWorkflowPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/crud-operations');
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <ImageBackground variant="gaming" className="flex-1">
        <GameSessionWorkflow onBack={handleBack} onComplete={handleComplete} />
      </ImageBackground>
      <Footer />
    </div>
  );
};