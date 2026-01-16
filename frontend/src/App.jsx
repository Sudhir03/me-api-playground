import React, { useState, useEffect } from "react";
import { Github, Linkedin, Globe, Search, ExternalLink } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [profile, setProfile] = useState(null);
  const [topSkills, setTopSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchTopSkills();
    fetchProjects();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        mode: "cors",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setProfile(data.profile);
      setError(null);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(err.message);
    }
  };

  const fetchTopSkills = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/skills/top`, {
        mode: "cors",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setTopSkills(data.top || []);
      setError(null);
    } catch (err) {
      console.error("Skills fetch error:", err);
    }
  };

  const fetchProjects = async (skill = null) => {
    try {
      setLoading(true);

      if (skill) {
        const res = await fetch(
          `${API_BASE_URL}/profile/projects?skill=${encodeURIComponent(skill)}`
        );
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        const res = await fetch(`${API_BASE_URL}/profile`);
        const data = await res.json();
        setProjects(data.profile?.projects || []);
        setError(null);
      }

      setSelectedSkill(skill);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillClick = (skill) => {
    setSearchQuery("");
    fetchProjects(skill);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProjects();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/profile/search?q=${encodeURIComponent(searchQuery)}`,
        {
          mode: "cors",
          headers: { Accept: "application/json" },
        }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setProjects(data.projects || []);
      setSelectedSkill(null);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedSkill(null);
    setSearchQuery("");
    fetchProjects();
  };

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <header className="bg-linear-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-6 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 tracking-tight">
                {profile?.name || "Loading..."}
              </h1>
              <p className="text-purple-100 text-lg mb-3">
                {profile?.email || ""}
              </p>
              {profile?.bio && (
                <p className="text-purple-50 text-base leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {profile?.links?.github && (
              <a
                href={profile?.links?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg font-semibold transition-all border border-white/30"
              >
                <Github size={18} />
                GitHub
              </a>
            )}
            {profile?.links?.linkedin && (
              <a
                href={profile?.links?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg font-semibold transition-all border border-white/30 flex items-center gap-2"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
            )}
            {profile?.links?.portfolio && (
              <a
                href={profile.links?.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg font-semibold transition-all border border-white/30 flex items-center gap-2"
              >
                <Globe size={18} />
                Portfolio
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Skills Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Top Skills
              </h2>
              <div className="flex flex-col gap-2">
                {topSkills.length > 0 ? (
                  topSkills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => handleSkillClick(skill)}
                      className={`px-4 py-3 rounded-lg font-semibold text-left transition-all ${
                        selectedSkill === skill
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No skills available</p>
                )}
              </div>
            </div>

            {/* Education Card */}
            {profile?.education && profile.education.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  🎓 Education
                </h2>

                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div
                      key={edu._id || index}
                      className="border-l-4 border-purple-500 pl-4 py-2"
                    >
                      <h3 className="font-bold text-gray-900 text-sm">
                        {edu.course}
                      </h3>

                      <p className="text-gray-600 text-sm">{edu.institute}</p>

                      <p className="text-purple-600 text-xs font-semibold mt-1">
                        {new Date(edu.startedAt).getFullYear()} –{" "}
                        {edu.ongoing
                          ? "Present"
                          : new Date(edu.completedAt).getFullYear()}
                      </p>

                      {edu.ongoing && (
                        <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Ongoing
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Projects Section */}
          <section className="lg:col-span-3">
            {/* Search Bar & Header */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Projects{" "}
                  {projects.length > 0 && (
                    <span className="text-lg font-medium text-gray-500">
                      ({projects.length})
                    </span>
                  )}
                </h2>

                {/* Search */}
                <div className="flex gap-2 flex-1 md:max-w-md">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    placeholder="Search projects..."
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedSkill || searchQuery) && (
                <div className="flex items-center gap-3 flex-wrap">
                  {selectedSkill && (
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                      Skill: {selectedSkill}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                  >
                    ✕ Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Projects Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <article
                    key={index}
                    className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {project.title || project.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                      {project.description || "No description available"}
                    </p>

                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      {project?.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <Github size={16} /> Code
                        </a>
                      )}
                      {project?.links?.live && (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-700 font-semibold mb-1">
            Built with Me-API Playground Backend
          </p>
          <p className="text-gray-500 text-sm">
            Demonstrating RESTful API Integration
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
