
import React, { useState } from 'react';
import { MessageCircle, Play, Image as ImageIcon, Users, Target, MessageSquare, Globe, CheckCircle, ExternalLink, X, FileText } from 'lucide-react';

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

interface PostCardProps {
  post: Post;
  index: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const getMediaType = (url: string) => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.ogg') || lowerUrl.includes('.mov') || lowerUrl.includes('.avi')) {
      return 'video';
    }
    if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerUrl.includes('.png') || lowerUrl.includes('.webp') || lowerUrl.includes('.gif')) {
      return 'image';
    }
    return 'unknown';
  };

  const obfuscateUrl = (url: string) => {
    if (url.startsWith('http')) {
      const urlParts = url.split('/');
      return `${urlParts[0]}//${urlParts[2]}/[...]/${urlParts[urlParts.length - 1]}`;
    }
    return url;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformColor = (platform: string) => {
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

  const handlePlatformClick = (platform: string) => {
    const link = post.post_links?.[platform];
    if (link && link.trim() !== '') {
      window.open(link, '_blank');
    } else {
      alert(`Not posted yet on ${platform}`);
    }
  };

  const handleWhatsAppClick = () => {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const message = `📝 *Content Feedback Request*\n\n` +
                   `*Post:* ${post.title}\n` +
                   `*Date:* ${formattedDate}\n\n` +
                   `*Description:* ${post.description}\n\n` +
                   `*Platforms:* ${post.platforms.join(', ')}\n` +
                   `*Target Audience:* ${post.audience.join(', ')}\n` +
                   `*Target Regions:* ${post.target.join(', ')}\n\n` +
                   `💭 My feedback: `;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mediaType === 'image' && !imageError) {
      setIsImageExpanded(true);
    }
  };

  const handleCloseExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageExpanded(false);
  };

  const mediaType = getMediaType(post.media_url);

  return (
    <>
      <div 
        className="bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 rounded-2xl border border-gray-200/60 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in backdrop-blur-sm"
        style={{ animationDelay: `${index * 150}ms` }}
      >
        {/* Media Preview */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {!imageError ? (
            mediaType === 'video' ? (
              <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <video
                  src={post.media_url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  controls
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none">
                  <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 text-gray-700 ml-1" />
                  </div>
                </div>
              </div>
            ) : mediaType === 'image' ? (
              <div 
                className="relative w-full h-full cursor-pointer group"
                onClick={handleImageClick}
              >
                <img
                  src={post.media_url}
                  alt={post.title}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none group-hover:from-black/30 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <ImageIcon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Unsupported media type</p>
                </div>
              </div>
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Media preview unavailable</p>
                <p className="text-xs text-gray-400 mt-1 px-4">{obfuscateUrl(post.media_url)}</p>
              </div>
            </div>
          )}
          
          {!imageLoaded && !imageError && mediaType === 'image' && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-sm"></div>
            </div>
          )}

          {/* Date, Platforms, and Approval badges */}
          <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg border border-white/20">
              <span className="text-xs font-semibold text-gray-700">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            {post.platforms.map((platform, idx) => (
              <button
                key={idx}
                onClick={() => handlePlatformClick(platform)}
                className={`${getPlatformColor(platform)} rounded-xl px-3 py-1.5 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer`}
              >
                <span className="text-xs font-semibold flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {platform}
                  <ExternalLink className="w-2.5 h-2.5 opacity-75" />
                </span>
              </button>
            ))}
            {post.approved && (
              <div className="bg-green-500 text-white rounded-xl px-3 py-1.5 shadow-lg">
                <span className="text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 space-y-4">
          {/* Status and ID */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(post.status)}`}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
            <span className="text-xs text-gray-500 font-mono">ID: {post.id}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-800 leading-tight line-clamp-2 hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-medium">
            {post.description}
          </p>

          {/* Captions */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-100">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Captions
            </span>
            <p className="text-sm text-slate-700 mt-2 font-medium leading-relaxed">
              {post.captions || post.description}
            </p>
          </div>

          {/* Benefit */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3" />
              Audience Benefit
            </span>
            <p className="text-sm text-emerald-700 mt-2 font-medium leading-relaxed">
              {post.benefit}
            </p>
          </div>

          {/* Audience & Tone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-100">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3" />
                Audience
              </span>
              <p className="text-xs text-purple-700 mt-1 font-medium">
                {post.audience.join(', ')}
              </p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-100">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                Tone
              </span>
              <p className="text-xs text-orange-700 mt-1 font-medium">
                {post.tone}
              </p>
            </div>
          </div>

          {/* Target Regions */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3" />
              Target Regions
            </span>
            <p className="text-sm text-blue-700 mt-2 font-medium leading-relaxed">
              {post.target.join(', ')}
            </p>
          </div>

          {/* Aim */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-4 border border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Aim</span>
            <p className="text-sm text-gray-700 mt-2 font-medium leading-relaxed">
              {post.aim}
            </p>
          </div>

          {/* Compact WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Send via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {isImageExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-[90vw] max-h-[90vh] animate-scale-in">
            <button
              onClick={handleCloseExpanded}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={post.media_url}
              alt={post.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={handleCloseExpanded}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
