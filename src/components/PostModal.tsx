
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import PostCard from './PostCard';

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
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  selectedDate: string | null;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, posts, selectedDate }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate total platforms for all posts
  const getTotalPlatforms = () => {
    const allPlatforms = new Set<string>();
    posts.forEach(post => {
      post.platforms.forEach(platform => allPlatforms.add(platform));
    });
    return allPlatforms.size;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Scheduled Posts
              </h2>
              {selectedDate && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(selectedDate)}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
            {posts.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {getTotalPlatforms()} {getTotalPlatforms() === 1 ? 'platform' : 'platforms'}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts scheduled for this date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
