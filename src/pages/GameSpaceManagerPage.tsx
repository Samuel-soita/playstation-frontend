import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GameSpaceManager } from '@/components/GameSpaceManager';
import { ImageBackground } from '@/components/ImageBackground';

export const GameSpaceManagerPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <ImageBackground variant="gaming" className="flex-1">
        <GameSpaceManager />
      </ImageBackground>
      <Footer />
    </div>
  );
};