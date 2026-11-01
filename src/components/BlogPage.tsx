import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  Share2, 
  BookOpen,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const { 
    blogPosts, 
    activeBlogSlug, 
    navigateToBlog, 
    navigateToBlogPost, 
    setCurrentView,
    showToast 
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = ['All', 'Baby Care', 'Newborn Essentials', 'Styling & Sizing', 'Heritage Fabrics'];

  // If viewing single article
  if (activeBlogSlug) {
    const post = blogPosts.find((p) => p.slug === activeBlogSlug);

    if (!post) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="font-editorial text-3xl font-bold text-stone-900 mb-4">
            Article Not Found
          </h2>
          <p className="text-sm text-stone-600 mb-8">
            The article you are looking for might have been moved or unpublished.
          </p>
          <button
            onClick={navigateToBlog}
            className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
          >
            Return to Blog
          </button>
        </div>
      );
    }

    const relatedPosts = blogPosts
      .filter((p) => p.id !== post.id && (p.category === post.category || p.isPublished))
      .slice(0, 3);

    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('Article link copied to clipboard!');
      }
    };

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Back to Blog */}
        <button
          onClick={navigateToBlog}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-stone-950 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        {/* Category & Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mb-4">
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-semibold rounded text-[11px] uppercase tracking-wider">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.publishedAt}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Share */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200 text-xs text-stone-600">
          <div>
            By <strong className="text-stone-900">{post.author}</strong>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] w-full rounded-sm overflow-hidden mb-10 shadow-lg border border-stone-200 bg-stone-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Excerpt Lead */}
        <p className="text-base sm:text-lg text-stone-800 font-normal leading-relaxed italic border-l-2 border-amber-700 pl-4 mb-8">
          {post.excerpt}
        </p>

        {/* Markdown-like article body */}
        <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-editorial text-2xl font-bold text-stone-900 pt-4">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('#### ')) {
              return (
                <h4 key={idx} className="font-editorial text-lg font-bold text-stone-900 pt-2">
                  {trimmed.replace('#### ', '')}
                </h4>
              );
            }
            return <p key={idx}>{trimmed}</p>;
          })}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 flex items-center gap-1 mr-2">
              <Tag className="w-3.5 h-3.5" />
              Topics:
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-200">
            <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-6">
              More From Auren Journal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigateToBlogPost(rel.slug)}
                  className="group cursor-pointer bg-white border border-stone-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 mt-1">
                      {rel.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  // Blog Directory View (/blog)
  const publishedPosts = blogPosts.filter((p) => p.isPublished);

  const filteredPosts = publishedPosts.filter((post) => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchTag = post.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchExcerpt && !matchTag) return false;
    }
    return true;
  });

  const featuredPost = publishedPosts[0];
  const regularPosts = filteredPosts.filter((p) => p.id !== (selectedCategory === 'All' && !searchQuery ? featuredPost?.id : null));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      
      {/* Blog Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-amber-800 text-xs uppercase tracking-widest font-semibold block mb-2">
          The Auren Journal
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
          Gentle Beginnings
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 font-light">
          Thoughts on heirloom subcontinental fabrics, newborn comfort, mindful parenting, and celebrations in Pakistan.
        </p>
        <div className="w-16 h-0.5 bg-amber-700/60 mx-auto mt-4"></div>
      </div>

      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-200">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & guides..."
            className="w-full bg-white border border-stone-200 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-stone-900"
          />
        </div>
      </div>

      {/* Featured Lead Article (when no active search/category filter) */}
      {selectedCategory === 'All' && !searchQuery.trim() && featuredPost && (
        <div 
          onClick={() => navigateToBlogPost(featuredPost.slug)}
          className="group cursor-pointer mb-16 bg-white border border-stone-200/90 rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-stone-100">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-widest rounded mb-4">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Featured Editorial
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors mb-3">
                {featuredPost.title}
              </h2>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light line-clamp-3 mb-6">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-100">
              <span className="font-medium text-stone-800">{featuredPost.author}</span>
              <div className="flex items-center gap-1 text-amber-800 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      {regularPosts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-sm">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-editorial text-2xl font-bold text-stone-900 mb-2">
            No Articles Found
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            We couldn&apos;t find any articles matching your search query. Try another keyword or browse all categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-6 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => navigateToBlogPost(post.slug)}
              className="group cursor-pointer bg-white border border-stone-200/90 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                    <span className="font-bold text-amber-800 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="font-editorial text-xl font-bold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{post.publishedAt}</span>
                <span className="text-amber-800 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
