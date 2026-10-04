/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RecipeProvider, useRecipes } from './context/RecipeContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { RecipeGrid } from './components/RecipeGrid.tsx';
import { RecipeDetailPage } from './components/RecipeDetailPage.tsx';
import { UserProfileView } from './components/UserProfileView.tsx';
import { CommunityRequestsView } from './components/CommunityRequestsView.tsx';
import { RecommendationModal } from './components/RecommendationModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';

const AppContent: React.FC = () => {
  const { activeView, selectedRecipe } = useRecipes();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {activeView === 'recipe-detail' && selectedRecipe ? (
          <RecipeDetailPage recipe={selectedRecipe} />
        ) : activeView === 'profile' ? (
          <UserProfileView />
        ) : activeView === 'requests' ? (
          <CommunityRequestsView />
        ) : (
          <>
            <HeroSection />
            <RecipeGrid />
          </>
        )}
      </main>

      <Footer />
      <RecommendationModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
}
