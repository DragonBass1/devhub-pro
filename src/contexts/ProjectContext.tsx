import React, { createContext, useContext, useState } from "react";
import type { Project } from "@/types";
import { projects } from "@/data/mockData";

interface ProjectContextType {
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  projects: Project[];
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0]);
  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject, projects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be within ProjectProvider");
  return ctx;
};
