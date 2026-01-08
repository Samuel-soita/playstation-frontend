import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GameLibrary } from '@/components/GameLibrary';
import { ImageBackground } from '@/components/ImageBackground';

export const GameLibraryPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <ImageBackground variant="gaming" className="flex-1">
        <GameLibrary />
      </ImageBackground>
      <Footer />
    </div>
  );
};