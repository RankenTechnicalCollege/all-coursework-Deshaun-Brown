import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import HomePage from './components/Hero';
import ProjectsPage from './components/Projects';
import SkillsPage from './components/Skills';
import ContactPage from './components/Contact';
import NotFoundPage from './components/NotFound';
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
      </Routes>
    </>
  );
}

export default App;