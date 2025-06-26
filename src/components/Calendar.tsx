
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Target, MessageSquare, Grid, CalendarDays } from 'lucide-react';
import PostCard from './PostCard';
import PostModal from './PostModal';
import CalendarView from './CalendarView';

interface Post {
  id: string;
  title: string;
  description: string;
  captions?: string;
  aim: string;
  benefit: string;
  audience: string[];
  target: string[];
  tone: string;
  platforms: string[];
  status: string;
  approved?: boolean;
  media_url: string;
  date: string;
  post_links?: {
    [key: string]: string;
  };
}

interface CalendarProps {
  clientId: string;
}

const Calendar: React.FC<CalendarProps> = ({ clientId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'calendar' | 'grid'>('calendar');
  const [currentMonthPosts, setCurrentMonthPosts] = useState<Post[]>([]);

  // Helper function to get month name for file loading
  const getMonthFileName = (date: Date) => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december'];
    return months[date.getMonth()];
  };

  // Load posts for the current month
  const loadMonthPosts = async (date: Date) => {
    try {
      const monthName = getMonthFileName(date);
      const response = await fetch(`/posts/${clientId}/${monthName}.json`);
      
      if (!response.ok) {
        console.log(`No data found for ${monthName} ${date.getFullYear()}`);
        return [];
      }
      
      const data: any[] = await response.json();
      console.log(`Raw data for ${monthName}:`, data);
      
      // Transform data to ensure consistent format
      const transformedPosts: Post[] = data.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        captions: post.captions,
        aim: post.aim,
        benefit: post.benefit,
        audience: Array.isArray(post.audience) ? post.audience : [post.audience || 'General audience'],
        target: Array.isArray(post.target) ? post.target : [post.target || 'All regions'],
        tone: post.tone,
        platforms: Array.isArray(post.platforms) ? post.platforms : [post.platform || 'Social Media'],
        status: post.status,
        approved: post.approved,
        media_url: post.media_url,
        date: post.date,
        post_links: post.post_links || {}
      }));

      console.log(`Transformed posts for ${monthName}:`, transformedPosts);
      return transformedPosts;
    } catch (error) {
      console.error(`Could not fetch posts for ${getMonthFileName(date)}:`, error);
      return [];
    }
  };

  // Load all available posts for the client (for platform discovery)
  const loadAllClientPosts = async () => {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december'];
    
    let allPosts: Post[] = [];
    
    for (const month of months) {
      try {
        const response = await fetch(`/posts/${clientId}/${month}.json`);
        if (response.ok) {
          const data: any[] = await response.json();
          const transformedPosts: Post[] = data.map(post => ({
            id: post.id,
            title: post.title,
            description: post.description,
            captions: post.captions,
            aim: post.aim,
            benefit: post.benefit,
            audience: Array.isArray(post.audience) ? post.audience : [post.audience || 'General audience'],
            target: Array.isArray(post.target) ? post.target : [post.target || 'All regions'],
            tone: post.tone,
            platforms: Array.isArray(post.platforms) ? post.platforms : [post.platform || 'Social Media'],
            status: post.status,
            approved: post.approved,
            media_url: post.media_url,
            date: post.date,
            post_links: post.post_links || {}
          }));
          allPosts = [...allPosts, ...transformedPosts];
        }
      } catch (error) {
        console.log(`No data for ${month}`);
      }
    }
    
    return allPosts;
  };

  // Load posts when component mounts or client changes
  useEffect(() => {
    const fetchAllPosts = async () => {
      if (clientId) {
        const allPosts = await loadAllClientPosts();
        setPosts(allPosts);

        // Extract unique platforms from all posts
        const platforms = new Set<string>();
        allPosts.forEach(post => {
          post.platforms.forEach(platform => platforms.add(platform));
        });
        setAvailablePlatforms(Array.from(platforms));
      }
    };

    fetchAllPosts();
  }, [clientId]);

  // Load posts for current month when date changes
  useEffect(() => {
    const fetchMonthPosts = async () => {
      if (clientId) {
        const monthPosts = await loadMonthPosts(currentDate);
        setCurrentMonthPosts(monthPosts);
      }
    };

    fetchMonthPosts();
  }, [clientId, currentDate]);

  const getSocialMediaColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600';
      case 'facebook':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'youtube':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'linkedin':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'twitter':
        return 'bg-sky-400 text-white hover:bg-sky-500';
      case 'tiktok':
        return 'bg-black text-white hover:bg-gray-800';
      case 'snapchat':
        return 'bg-yellow-400 text-black hover:bg-yellow-500';
      default:
        return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getPlatformBadgeColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return 'bg-red-500 text-white';
      case 'facebook':
        return 'bg-blue-500 text-white';
      case 'youtube':
        return 'bg-red-600 text-white';
      case 'linkedin':
        return 'bg-blue-600 text-white';
      case 'twitter':
        return 'bg-sky-500 text-white';
      case 'tiktok':
        return 'bg-black text-white';
      case 'snapchat':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Get platform post count for current month only
  const getPlatformPostCount = (platform: string) => {
    return currentMonthPosts.filter(post => 
      post.platforms.includes(platform) && 
      (selectedPlatform === null || selectedPlatform === platform)
    ).length;
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDateClick = (date: string, postsForDate: Post[]) => {
    if (postsForDate.length === 1) {
      setSelectedPost(postsForDate[0]);
    } else {
      setSelectedPost(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  // Filter posts based on selected platform, using current month posts for calendar view
  const filteredPosts = selectedPlatform
    ? (viewMode === 'calendar' ? currentMonthPosts : posts).filter(post => post.platforms.includes(selectedPlatform))
    : (viewMode === 'calendar' ? currentMonthPosts : posts);

  console.log("Current month posts:", currentMonthPosts);
  console.log("Filtered posts:", filteredPosts);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Content Calendar - {clientId}
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 flex-1 sm:flex-none justify-center ${
                      viewMode === 'calendar'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span className="hidden sm:inline">Calendar</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 flex-1 sm:flex-none justify-center ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    {currentDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Social Media Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPlatform(null)}
                className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedPlatform === null
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Platforms
              </button>
              {availablePlatforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 relative ${
                    selectedPlatform === platform
                      ? getSocialMediaColor(platform)
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {platform}
                  {/* Post count badge - now shows current month count */}
                  <span className={`absolute -top-2 -right-2 ${getPlatformBadgeColor(platform)} text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center font-bold shadow-sm`}>
                    {getPlatformPostCount(platform)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'calendar' ? (
          <CalendarView
            posts={filteredPosts}
            onDateClick={handleDateClick}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <button key={post.id} onClick={() => handlePostClick(post)} className="w-full">
                  <PostCard post={post} index={index} />
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No posts found for {clientId}</p>
                <p className="text-gray-400 text-sm mt-2">Check if the posts JSON files exist in the client folder</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Modal */}
      <PostModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        posts={selectedPost ? [selectedPost] : []} 
        selectedDate={selectedPost?.date || null} 
      />
    </div>
  );
};

export default Calendar;
