import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { WorkoutPlannerPage } from './pages/WorkoutPlannerPage';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { DietNutritionPage } from './pages/DietNutritionPage';
import { ProgressTrackingPage } from './pages/ProgressTrackingPage';
import { AiCoachPage } from './pages/AiCoachPage';
import { BmiCalculatorPage } from './pages/BmiCalculatorPage';
import { CalorieCalculatorPage } from './pages/CalorieCalculatorPage';
import { WaterTrackerPage } from './pages/WaterTrackerPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { TrainersPage } from './pages/TrainersPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { ContactPage } from './pages/ContactPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AuthPages } from './pages/AuthPages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { TrainerDashboardPage } from './pages/TrainerDashboardPage';
import { JavaArchitecturePage } from './pages/JavaArchitecturePage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const { currentUser } = useApp();

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'user-dashboard':
        return <UserDashboardPage setCurrentPage={setCurrentPage} />;
      case 'workout-planner':
        return <WorkoutPlannerPage setCurrentPage={setCurrentPage} />;
      case 'exercises':
        return <ExerciseLibraryPage setCurrentPage={setCurrentPage} />;
      case 'diet':
        return <DietNutritionPage setCurrentPage={setCurrentPage} />;
      case 'progress':
        return <ProgressTrackingPage setCurrentPage={setCurrentPage} />;
      case 'ai-coach':
        return <AiCoachPage setCurrentPage={setCurrentPage} />;
      case 'bmi':
        return <BmiCalculatorPage setCurrentPage={setCurrentPage} />;
      case 'calorie-calc':
        return <CalorieCalculatorPage setCurrentPage={setCurrentPage} />;
      case 'water':
        return <WaterTrackerPage setCurrentPage={setCurrentPage} />;
      case 'challenges':
        return <ChallengesPage setCurrentPage={setCurrentPage} />;
      case 'programs':
        return <ProgramsPage setCurrentPage={setCurrentPage} />;
      case 'trainers':
        return <TrainersPage setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'blog':
        return <BlogPage setCurrentPage={setCurrentPage} />;
      case 'stories':
        return <SuccessStoriesPage setCurrentPage={setCurrentPage} />;
      case 'contact':
        return <ContactPage setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <UserProfilePage setCurrentPage={setCurrentPage} />;
      case 'login':
        return <AuthPages initialMode="login" setCurrentPage={setCurrentPage} />;
      case 'register':
        return <AuthPages initialMode="register" setCurrentPage={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboardPage setCurrentPage={setCurrentPage} />;
      case 'trainer-dashboard':
        return <TrainerDashboardPage setCurrentPage={setCurrentPage} />;
      case 'java-rubric':
        return <JavaArchitecturePage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E7] text-[#1E211B] font-sans antialiased selection:bg-[#596044] selection:text-white">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
