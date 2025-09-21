import { useState } from "react";
import BusStopAdmin from "./components/BusStopAdmin";
import RouteCreation from "./components/RouteCreation";

type Page = "bus-stops" | "routes";

export interface ThemeGradients {
  logo: string;
  stats1: string;
  stats2: string;
  fab: string;
  card: string;
  navActive1: string;
  navActive2: string;
  pageBackground: string;
  cardBackground: string;
  buttonPrimary: string;
  buttonSecondary: string;
  inputFocus: string;
  textPrimary: string;
  textAccent: string;
}

export interface Theme {
  name: string;
  primary: string;
  accent: string;
  colors: string[];
  gradients: ThemeGradients;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("bus-stops");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  
  const themes: Theme[] = [
    { 
      name: "Ocean", 
      primary: "blue", 
      accent: "indigo", 
      colors: ["bg-blue-500", "bg-indigo-500"],
      gradients: {
        logo: "bg-gradient-to-r from-blue-600 to-indigo-600",
        stats1: "bg-gradient-to-r from-blue-500 to-blue-600",
        stats2: "bg-gradient-to-r from-indigo-500 to-indigo-600",
        fab: "bg-gradient-to-r from-indigo-500 to-purple-600",
        card: "bg-gradient-to-r from-blue-500/90 to-indigo-500/90",
        navActive1: "bg-white text-blue-700 shadow-md transform scale-105",
        navActive2: "bg-white text-indigo-700 shadow-md transform scale-105",
        pageBackground: "bg-gradient-to-br from-blue-50 via-white to-indigo-50",
        cardBackground: "bg-white/80",
        buttonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        buttonSecondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
        inputFocus: "focus:ring-blue-500 focus:border-blue-500",
        textPrimary: "text-blue-600",
        textAccent: "text-indigo-600"
      }
    },
    { 
      name: "Sunset", 
      primary: "orange", 
      accent: "red", 
      colors: ["bg-orange-500", "bg-red-500"],
      gradients: {
        logo: "bg-gradient-to-r from-orange-600 to-red-600",
        stats1: "bg-gradient-to-r from-orange-500 to-orange-600",
        stats2: "bg-gradient-to-r from-red-500 to-red-600",
        fab: "bg-gradient-to-r from-orange-500 to-red-600",
        card: "bg-gradient-to-r from-orange-500/90 to-red-500/90",
        navActive1: "bg-white text-orange-700 shadow-md transform scale-105",
        navActive2: "bg-white text-red-700 shadow-md transform scale-105",
        pageBackground: "bg-gradient-to-br from-orange-50 via-white to-red-50",
        cardBackground: "bg-white/80",
        buttonPrimary: "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700",
        buttonSecondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
        inputFocus: "focus:ring-orange-500 focus:border-orange-500",
        textPrimary: "text-orange-600",
        textAccent: "text-red-600"
      }
    },
    { 
      name: "Forest", 
      primary: "green", 
      accent: "emerald", 
      colors: ["bg-green-500", "bg-emerald-500"],
      gradients: {
        logo: "bg-gradient-to-r from-green-600 to-emerald-600",
        stats1: "bg-gradient-to-r from-green-500 to-green-600",
        stats2: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        fab: "bg-gradient-to-r from-green-500 to-emerald-600",
        card: "bg-gradient-to-r from-green-500/90 to-emerald-500/90",
        navActive1: "bg-white text-green-700 shadow-md transform scale-105",
        navActive2: "bg-white text-emerald-700 shadow-md transform scale-105",
        pageBackground: "bg-gradient-to-br from-green-50 via-white to-emerald-50",
        cardBackground: "bg-white/80",
        buttonPrimary: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
        buttonSecondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
        inputFocus: "focus:ring-green-500 focus:border-green-500",
        textPrimary: "text-green-600",
        textAccent: "text-emerald-600"
      }
    },
    { 
      name: "Purple Rain", 
      primary: "purple", 
      accent: "violet", 
      colors: ["bg-purple-500", "bg-violet-500"],
      gradients: {
        logo: "bg-gradient-to-r from-purple-600 to-violet-600",
        stats1: "bg-gradient-to-r from-purple-500 to-purple-600",
        stats2: "bg-gradient-to-r from-violet-500 to-violet-600",
        fab: "bg-gradient-to-r from-purple-500 to-violet-600",
        card: "bg-gradient-to-r from-purple-500/90 to-violet-500/90",
        navActive1: "bg-white text-purple-700 shadow-md transform scale-105",
        navActive2: "bg-white text-violet-700 shadow-md transform scale-105",
        pageBackground: "bg-gradient-to-br from-purple-50 via-white to-violet-50",
        cardBackground: "bg-white/80",
        buttonPrimary: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
        buttonSecondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
        inputFocus: "focus:ring-purple-500 focus:border-purple-500",
        textPrimary: "text-purple-600",
        textAccent: "text-violet-600"
      }
    },
    { 
      name: "Rose Gold", 
      primary: "pink", 
      accent: "rose", 
      colors: ["bg-pink-500", "bg-rose-500"],
      gradients: {
        logo: "bg-gradient-to-r from-pink-600 to-rose-600",
        stats1: "bg-gradient-to-r from-pink-500 to-pink-600",
        stats2: "bg-gradient-to-r from-rose-500 to-rose-600",
        fab: "bg-gradient-to-r from-pink-500 to-rose-600",
        card: "bg-gradient-to-r from-pink-500/90 to-rose-500/90",
        navActive1: "bg-white text-pink-700 shadow-md transform scale-105",
        navActive2: "bg-white text-rose-700 shadow-md transform scale-105",
        pageBackground: "bg-gradient-to-br from-pink-50 via-white to-rose-50",
        cardBackground: "bg-white/80",
        buttonPrimary: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700",
        buttonSecondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
        inputFocus: "focus:ring-pink-500 focus:border-pink-500",
        textPrimary: "text-pink-600",
        textAccent: "text-rose-600"
      }
    },
    { 
      name: "Cyber", 
      primary: "cyan", 
      accent: "teal", 
      colors: ["bg-cyan-500", "bg-teal-500"],
      gradients: {
        logo: "bg-gradient-to-r from-cyan-600 to-teal-600",
        stats1: "bg-gradient-to-r from-cyan-500 to-cyan-600",
        stats2: "bg-gradient-to-r from-teal-500 to-teal-600",
        fab: "bg-gradient-to-r from-cyan-500 to-teal-600",
        card: "bg-gradient-to-r from-cyan-500/90 to-teal-500/90",
        navActive1: "bg-white text-cyan-700 shadow-md transform scale-105",
        navActive2: "bg-white text-teal-700 shadow-md transform scale-105",
        pageBackground: "bg-gradient-to-br from-cyan-50 via-white to-teal-50",
        cardBackground: "bg-white/80",
        buttonPrimary: "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700",
        buttonSecondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
        inputFocus: "focus:ring-cyan-500 focus:border-cyan-500",
        textPrimary: "text-cyan-600",
        textAccent: "text-teal-600"
      }
    }
  ];

  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  const handlePageChange = (newPage: Page) => {
    if (newPage === currentPage) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  const fabActions = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      label: "Add Bus Stop",
      action: () => handlePageChange("bus-stops"),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      label: "Create Route",
      action: () => handlePageChange("routes"),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      label: "Refresh Data",
      action: () => window.location.reload(),
      color: "from-green-500 to-green-600"
    }
  ];

  const currentThemeData = currentTheme;

  return (
    <div className={`min-h-screen ${currentThemeData.gradients.pageBackground} transition-all duration-700 relative`}>
      {/* Enhanced Background Elements - Fixed position to cover entire viewport */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large gradient orbs */}
        <div className={`absolute -top-32 -right-32 w-96 h-96 ${currentThemeData.colors[0]} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse`}></div>
        <div className={`absolute -bottom-32 -left-32 w-96 h-96 ${currentThemeData.colors[1]} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse`} style={{animationDelay: '2s'}}></div>
        <div className={`absolute top-1/4 right-1/3 w-64 h-64 ${currentThemeData.colors[0]} rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse`} style={{animationDelay: '4s'}}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-48 h-48 ${currentThemeData.colors[1]} rounded-full mix-blend-multiply filter blur-2xl opacity-25 animate-pulse`} style={{animationDelay: '6s'}}></div>
        
        {/* Floating geometric shapes */}
        <div className={`absolute top-1/5 left-1/5 w-32 h-32 ${currentThemeData.colors[0]} rotate-45 mix-blend-multiply filter blur-xl opacity-20 animate-pulse`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute bottom-1/5 right-1/5 w-24 h-24 ${currentThemeData.colors[1]} rotate-12 mix-blend-multiply filter blur-xl opacity-20 animate-pulse`} style={{animationDelay: '3s'}}></div>
        <div className={`absolute top-2/3 left-2/3 w-40 h-40 ${currentThemeData.colors[0]} rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse`} style={{animationDelay: '5s'}}></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-transparent opacity-40"></div>
      </div>
      {/* Navigation */}
  <nav className="bg-gradient-to-r from-white/80 via-gray-100 to-white/80 backdrop-blur-md shadow-2xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-12">
              {/* Logo/Brand */}
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${currentThemeData.gradients.logo} rounded-xl flex items-center justify-center shadow-lg`}>
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    1Stop Transit
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
                </div>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex space-x-2 bg-gray-100/50 p-1 rounded-xl">
                <button
                  onClick={() => handlePageChange("bus-stops")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    currentPage === "bus-stops"
                      ? currentThemeData.gradients.navActive1
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>Bus Stops</span>
                </button>
                <button
                  onClick={() => handlePageChange("routes")}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    currentPage === "routes"
                      ? currentThemeData.gradients.navActive2
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <span>Routes</span>
                </button>
              </div>
            </div>
            
            {/* Theme Switcher - RELATIVE WRAPPER */}
            <div className="relative flex items-center space-x-4">
              <button
                onClick={() => setShowThemePanel(!showThemePanel)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Change Theme"
                id="theme-switch-btn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </button>
              {/* Theme Panel - absolutely positioned below button */}
              <div
                className={`absolute left-0 top-full mt-2 rounded-xl border border-gray-200 p-4 transition-all duration-300 z-50 min-w-[200px] shadow-2xl backdrop-blur-lg ${
                  showThemePanel ? "opacity-100 visible transform translate-y-0" : "opacity-0 invisible transform -translate-y-2"
                }`}
                style={{
                  background: `linear-gradient(135deg, #f8fafc 60%, ${currentThemeData.gradients.pageBackground.split(' ').pop() || '#e0e7ff'} 100%)`,
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  border: '1px solid rgba(200,200,200,0.25)'
                }}
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((theme, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentTheme(theme);
                        setShowThemePanel(false);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        currentTheme.primary === theme.primary 
                          ? "border-gray-400 shadow-md" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${theme.colors[0]}`}></div>
                        <div className={`w-3 h-3 rounded-full ${theme.colors[1]}`}></div>
                      </div>
                      <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Panel outside nav removed; only one panel now, inside nav next to button */}

        {/* Sidebar Live Stats Dashboard */}
      </nav>

      {/* Page Content */}
      <main className="min-h-[calc(100vh-200px)] relative overflow-hidden z-10">
        <div className={`absolute inset-0 transition-all duration-300 ${
          isTransitioning 
            ? "transform translate-x-full opacity-0" 
            : "transform translate-x-0 opacity-100"
        }`}>
          {currentPage === "bus-stops" && (
            <div className="transform transition-all duration-500 ease-out">
              <BusStopAdmin theme={currentThemeData} />
            </div>
          )}
          {currentPage === "routes" && (
            <div className="transform transition-all duration-500 ease-out">
              <RouteCreation theme={currentThemeData} />
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* FAB Menu Items */}
        <div className={`absolute bottom-20 right-0 space-y-4 transition-all duration-300 ${
          showFABMenu 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}>
          {fabActions.map((action, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className={`${currentThemeData.gradients.card} backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl shadow-xl whitespace-nowrap font-medium`}>
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.action();
                  setShowFABMenu(false);
                }}
                className={`w-14 h-14 bg-gradient-to-r ${action.color} text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20`}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setShowFABMenu(!showFABMenu)}
          className={`w-16 h-16 ${currentThemeData.gradients.fab} text-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-white/20 ${
            showFABMenu ? "rotate-45" : "rotate-0"
          }`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
