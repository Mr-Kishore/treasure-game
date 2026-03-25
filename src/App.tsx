import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Levels from "./pages/Levels";
import Game from "./pages/Game";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherDashboard from "./pages/TeacherDashboard";
import SelectQuestionSet from "./pages/SelectQuestionSet";
import PlayTeacherSet from "./pages/PlayTeacherSet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* "/" is now the login/signup page */}
          <Route path="/" element={<Index />} />

          {/* "/home" is the treasure hunt landing (requires login) */}
          <Route path="/home" element={<Home />} />

          {/* Old /student-auth redirects to "/" */}
          <Route path="/student-auth" element={<Navigate to="/" replace />} />

          <Route path="/levels" element={<Levels />} />
          <Route path="/game/:levelId" element={<Game />} />
          <Route path="/teacher" element={<TeacherLogin />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/select-mode" element={<SelectQuestionSet />} />
          <Route path="/play/:setId" element={<PlayTeacherSet />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;