import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import ContactPage from './pages/ContactPage';
import TypescriptPage from './pages/TypescriptPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/typescript" element={<TypescriptPage/>} />
      </Routes>
    </>
  );
}

export default App;