import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Calendar, TrendingUp, BarChart3, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CPUGamingDashboard = () => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedSKU, setSelectedSKU] = useState('');
  const [selectedBuild, setSelectedBuild] = useState('');
  const [expandedPrograms, setExpandedPrograms] = useState(new Set());
  const [expandedGames, setExpandedGames] = useState(new Set());

  // Mock data structure
  const programData = {
    'Arrow Lake': {
      skus: ['Arrow Lake S', 'Arrow Lake H', 'Arrow Lake P'],
      color: '#3b82f6'
    },
    'Nova Lake': {
      skus: ['Nova Lake S', 'Nova Lake H'],
      color: '#10b981'
    },
    'Arrow Lake Refresh': {
      skus: ['Arrow Lake Refresh S', 'Arrow Lake Refresh H'],
      color: '#8b5cf6'
    },
    'Panther Lake': {
      skus: ['Panther Lake P', 'Panther Lake U'],
      color: '#f59e0b'
    },
    'Battrel Lake': {
      skus: ['Battrel Lake S', 'Battrel Lake P'],
      color: '#ef4444'
    }
  };

  // Mock build data (bi-weekly builds)
  const mockBuilds = [
    'Build 2025.03 (Aug 18)', 'Build 2025.02 (Aug 4)', 'Build 2025.01 (Jul 21)',
    'Build 2024.26 (Jul 7)', 'Build 2024.25 (Jun 23)', 'Build 2024.24 (Jun 9)'
  ];

  // Generate weekly trend data for program overview
  const generateWeeklyTrendData = (program) => {
    const skus = programData[program].skus;
    const weeks = [
      'Week 33 (Aug 18)', 'Week 31 (Aug 4)', 'Week 29 (Jul 21)', 
      'Week 27 (Jul 7)', 'Week 25 (Jun 23)', 'Week 23 (Jun 9)',
      'Week 21 (May 26)', 'Week 19 (May 12)', 'Week 17 (Apr 28)',
      'Week 15 (Apr 14)', 'Week 13 (Mar 31)', 'Week 11 (Mar 17)'
    ];
    
    return weeks.reverse().map((week, weekIndex) => {
      const weekData = { week: week.split(' (')[0] }; // Just show "Week X"
      
      skus.forEach(sku => {
        // Generate consistent trend based on SKU name and week
        const skuSeed = sku.length * 7 + weekIndex * 3;
        const trend = Math.sin(skuSeed / 5) * 10 + Math.random() * 8;
        const basePerformance = 95 + (skuSeed % 25); // Base performance varies by SKU
        weekData[sku] = Math.round(basePerformance + trend);
      });
      
      return weekData;
    });
  };

  // Mock games data (34 games)
  const mockGames = [
    'Cyberpunk 2077', 'Call of Duty: MW III', 'Assassin\'s Creed Mirage', 'Baldur\'s Gate 3',
    'Starfield', 'Forza Horizon 5', 'Red Dead Redemption 2', 'The Witcher 3',
    'Horizon Zero Dawn', 'Control', 'Metro Exodus', 'Shadow of the Tomb Raider',
    'Total War: Warhammer III', 'F1 23', 'Far Cry 6', 'Resident Evil 4',
    'Spider-Man Remastered', 'God of War', 'Death Stranding', 'Hitman 3',
    'Watch Dogs: Legion', 'Dirt 5', 'Borderlands 3', 'The Division 2',
    'Gears 5', 'Strange Brigade', 'Serious Sam 4', 'World War Z',
    'Rainbow Six Siege', 'Overwatch 2', 'Valorant', 'Counter-Strike 2',
    'Dota 2', 'League of Legends'
  ];

  // Generate mock benchmark data
  const generateMockScores = () => {
    return mockGames.map(game => ({
      game,
      score: Math.floor(Math.random() * 100) + 60, // 60-160 FPS range
      percentile: Math.floor(Math.random() * 40) + 60 // 60-100 percentile
    }));
  };

  // Generate mock CPU metrics for expanded game view
  const generateCPUMetrics = (gameName) => {
    // Seed random generation based on game name for consistency
    const seed = gameName.length * 13;
    const seededRandom = (min, max) => {
      const x = Math.sin(seed * 9.9731) * 10000;
      return min + ((x - Math.floor(x)) * (max - min));
    };

    const clippingReasons = [
      'None', 'Thermal', 'Power', 'Current', 'Thermal + Power', 'Power + Current'
    ];

    return {
      avgPCoreFreq: (seededRandom(4.5, 5.8)).toFixed(2),
      avgECoreFreq: (seededRandom(3.2, 4.4)).toFixed(2),
      avgIAPower: (seededRandom(45, 125)).toFixed(1),
      avgPackagePower: (seededRandom(65, 185)).toFixed(1),
      iaClippingReason: clippingReasons[Math.floor(seededRandom(0, clippingReasons.length))],
      avgPkgTemperature: Math.floor(seededRandom(55, 85))
    };
  };

  const toggleGameExpansion = (gameName) => {
    const newExpanded = new Set(expandedGames);
    if (newExpanded.has(gameName)) {
      newExpanded.delete(gameName);
    } else {
      newExpanded.add(gameName);
    }
    setExpandedGames(newExpanded);
  };

  const toggleProgramExpansion = (program) => {
    const newExpanded = new Set(expandedPrograms);
    if (newExpanded.has(program)) {
      newExpanded.delete(program);
    } else {
      newExpanded.add(program);
    }
    setExpandedPrograms(newExpanded);
  };

  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
    setSelectedSKU('');
    setSelectedBuild('');
    if (!expandedPrograms.has(program)) {
      toggleProgramExpansion(program);
    }
  };

  const handleSKUSelect = (sku) => {
    setSelectedSKU(sku);
    setSelectedBuild('');
    setExpandedGames(new Set());
  };

  const benchmarkData = useMemo(() => {
    if (selectedSKU && selectedBuild) {
      return generateMockScores();
    }
    return [];
  }, [selectedSKU, selectedBuild]);

  const averageScore = useMemo(() => {
    if (benchmarkData.length === 0) return 0;
    return Math.round(benchmarkData.reduce((sum, item) => sum + item.score, 0) / benchmarkData.length);
  }, [benchmarkData]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h1 className="text-lg font-bold">Gaming Benchmark Dashboard</h1>
          <p className="text-sm text-blue-100 mt-1">CPU Performance Analysis</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Programs
            </h2>
            
            {Object.entries(programData).map(([program, data]) => (
              <div key={program} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleProgramSelect(program)}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left transition-all duration-200 hover:bg-gray-50 ${
                    selectedProgram === program ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: data.color }}
                    ></div>
                    <span className="font-medium text-sm">{program}</span>
                  </div>
                  {expandedPrograms.has(program) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                  }
                </button>
                
                {expandedPrograms.has(program) && (
                  <div className="bg-gray-50 border-t border-gray-200">
                    {data.skus.map((sku) => (
                      <button
                        key={sku}
                        onClick={() => handleSKUSelect(sku)}
                        className={`w-full px-6 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                          selectedSKU === sku ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-600'
                        }`}
                      >
                        {sku}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedSKU && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Builds
              </h3>
              <div className="space-y-1">
                {mockBuilds.map((build) => (
                  <button
                    key={build}
                    onClick={() => setSelectedBuild(build)}
                    className={`w-full px-3 py-2 text-left text-xs rounded-md transition-colors flex items-center space-x-2 ${
                      selectedBuild === build 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{build}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gaming Benchmark Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                1080p High Settings • 34 Game Benchmark Suite
              </p>
            </div>
            {selectedSKU && selectedBuild && (
              <div className="text-right">
                <div className="text-sm text-gray-500">{selectedProgram}</div>
                <div className="font-semibold text-gray-900">{selectedSKU}</div>
                <div className="text-xs text-gray-500">{selectedBuild}</div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {!selectedProgram ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Program</h3>
                <p className="text-gray-500">Choose a CPU program from the left sidebar to view benchmark results</p>
              </div>
            </div>
          ) : !selectedSKU ? (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedProgram} - Performance Trends</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Weekly average performance across 34 games (1080p High Settings)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: programData[selectedProgram].color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-600">{selectedProgram}</span>
                  </div>
                </div>
                
                {/* Individual SKU Trend Charts */}
                <div className="space-y-6">
                  {programData[selectedProgram].skus.map((sku, index) => {
                    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
                    const skuColor = colors[index % colors.length];
                    const trendData = generateWeeklyTrendData(selectedProgram);
                    const skuTrendData = trendData.map(week => ({
                      week: week.week,
                      performance: week[sku]
                    }));
                    
                    const latestPerformance = skuTrendData[skuTrendData.length - 1].performance;
                    const previousPerformance = skuTrendData[skuTrendData.length - 2].performance;
                    const change = latestPerformance - previousPerformance;
                    const minValue = Math.min(...skuTrendData.map(d => d.performance));
                    const maxValue = Math.max(...skuTrendData.map(d => d.performance));
                    
                    return (
                      <div key={sku} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: skuColor }}
                            ></div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{sku}</h4>
                              <p className="text-sm text-gray-500">Average FPS Trend</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {latestPerformance} <span className="text-sm font-normal text-gray-500">FPS</span>
                            </div>
                            <div className={`text-sm flex items-center justify-end space-x-1 ${
                              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              <span>{change > 0 ? '↗' : change < 0 ? '↘' : '→'}</span>
                              <span>{Math.abs(change).toFixed(1)} vs last week</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={skuTrendData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis 
                                dataKey="week" 
                                stroke="#6b7280"
                                fontSize={12}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis 
                                stroke="#6b7280"
                                fontSize={12}
                                domain={[minValue - 3, maxValue + 3]}
                                label={{ value: 'FPS', angle: -90, position: 'insideLeft' }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'white',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '6px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value) => [`${value} FPS`, sku]}
                                labelFormatter={(label) => `${label}`}
                              />
                              <Line
                                type="monotone"
                                dataKey="performance"
                                stroke={skuColor}
                                strokeWidth={3}
                                dot={{ fill: skuColor, strokeWidth: 2, r: 5 }}
                                activeDot={{ r: 7, stroke: skuColor, strokeWidth: 2 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Min</div>
                            <div className="text-lg font-semibold text-red-600">{minValue} FPS</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Max</div>
                            <div className="text-lg font-semibold text-green-600">{maxValue} FPS</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Range</div>
                            <div className="text-lg font-semibold text-blue-600">{maxValue - minValue} FPS</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Select a SKU</strong> from the left sidebar to view detailed build-specific results and individual game performance metrics.
                </p>
              </div>
            </div>
          ) : !selectedBuild ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Build</h3>
                <p className="text-gray-500">Choose a build to view gaming benchmark results</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Average FPS</div>
                  <div className="text-2xl font-bold text-blue-600">{averageScore}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Total Games</div>
                  <div className="text-2xl font-bold text-green-600">{mockGames.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Resolution</div>
                  <div className="text-2xl font-bold text-purple-600">1080p</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="text-sm text-gray-500">Settings</div>
                  <div className="text-2xl font-bold text-orange-600">High</div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Game Performance Results</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Game Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FPS Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentile
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Performance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {benchmarkData.map((result, index) => {
                        const isExpanded = expandedGames.has(result.game);
                        const cpuMetrics = generateCPUMetrics(result.game);
                        return (
                          <React.Fragment key={index}>
                            <tr 
                              onClick={() => toggleGameExpansion(result.game)}
                              className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <div className="flex items-center space-x-2">
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                  )}
                                  <span>{result.game}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="font-semibold">{result.score}</span> FPS
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.percentile}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        result.score >= 120 ? 'bg-green-500' :
                                        result.score >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${Math.min((result.score / 160) * 100, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className={`text-xs font-medium ${
                                    result.score >= 120 ? 'text-green-600' :
                                    result.score >= 90 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {result.score >= 120 ? 'Excellent' :
                                     result.score >= 90 ? 'Good' : 'Fair'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr>
                                <td colSpan="4" className="px-6 py-0 bg-gray-50">
                                  <div className="py-4 border-t border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                      CPU Performance Metrics
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                          Avg P Core Frequency
                                        </div>
                                        <div className="text-lg font-bold text-blue-600 mt-1">
                                          {cpuMetrics.avgPCoreFreq} GHz
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                          Avg E Core Frequency
                                        </div>
                                        <div className="text-lg font-bold text-purple-600 mt-1">
                                          {cpuMetrics.avgECoreFreq} GHz
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                          Avg IA Power
                                        </div>
                                        <div className="text-lg font-bold text-green-600 mt-1">
                                          {cpuMetrics.avgIAPower} W
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                          Avg Package Power
                                        </div>
                                        <div className="text-lg font-bold text-orange-600 mt-1">
                                          {cpuMetrics.avgPackagePower} W
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                          IA Clipping Reason
                                        </div>
                                        <div className={`text-lg font-bold mt-1 ${
                                          cpuMetrics.iaClippingReason === 'None' ? 'text-green-600' :
                                          cpuMetrics.iaClippingReason.includes('Thermal') ? 'text-red-600' :
                                          'text-yellow-600'
                                        }`}>
                                          {cpuMetrics.iaClippingReason}
                                        </div>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                                          Avg Package Temperature
                                        </div>
                                        <div className={`text-lg font-bold mt-1 ${
                                          cpuMetrics.avgPkgTemperature <= 70 ? 'text-green-600' :
                                          cpuMetrics.avgPkgTemperature <= 80 ? 'text-yellow-600' :
                                          'text-red-600'
                                        }`}>
                                          {cpuMetrics.avgPkgTemperature}°C
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CPUGamingDashboard;