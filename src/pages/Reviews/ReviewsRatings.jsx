import { useEffect, useRef, useState } from 'react';
import appReviewApi from '../../api/appReviewApi';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './ReviewsRatings.css';

const TABS = ['Rate the App', 'My Reviews', 'Community'];

/* ── Star Rating Widget ──────────────────────────────────── */
function StarRating({ value, onChange, readonly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={`rr-stars rr-stars-${size}`} onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`rr-star ${(hovered || value) >= star ? 'filled' : ''}`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onClick={() => !readonly && onChange && onChange(star)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Forum helpers ───────────────────────────────────────── */
function getPosts() {
  try { return JSON.parse(localStorage.getItem('sp_community_posts') || '[]'); }
  catch { return []; }
}
function savePosts(p) { localStorage.setItem('sp_community_posts', JSON.stringify(p)); }
function getCurrentUser() {
  try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u.name || 'You'; }
  catch { return 'You'; }
}

/* ── Write Review Tab ────────────────────────────────────── */
const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const APP_ASPECTS = ['Easy to use', 'Great providers', 'Fast booking', 'Good value', 'Reliable service'];

/* ── Rate the App Tab ────────────────────────────────────── */
function RateAppTab() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const toggleTag = (tag) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSubmit = async () => {
    if (rating === 0) return setError('Please select a star rating.');
    if (!comment.trim()) return setError('Please write a short review.');
    setError('');
    setSubmitting(true);
    try {
      await appReviewApi.create({ rating, comment: comment.trim() });
      setSuccess('Thank you for your feedback! Your review has been saved.');
      setRating(0);
      setComment('');
      setTags([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rr-write-panel">
      {/* Hero Banner */}
      <div className="rr-app-banner">
        <div className="rr-app-banner-icon">🚀</div>
        <div>
          <h2>How are we doing?</h2>
          <p>Your honest feedback helps us build a better ServicePro for everyone.</p>
        </div>
      </div>

      {success && (
        <div className="rr-alert rr-alert-success">✓ {success}<button onClick={() => setSuccess('')}>✕</button></div>
      )}
      {error && (
        <div className="rr-alert rr-alert-error">⚠ {error}<button onClick={() => setError('')}>✕</button></div>
      )}

      {/* Star Rating */}
      <div className="rr-field">
        <label>Overall Rating</label>
        <div className="rr-rating-center">
          <StarRating value={rating} onChange={(v) => { setRating(v); setError(''); }} size="xl" />
          {rating > 0 && <span className="rr-rating-label-big">{RATING_LABELS[rating]}</span>}
        </div>
      </div>

      {/* Quick Tags */}
      <div className="rr-field">
        <label>What did you love? <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span></label>
        <div className="rr-tags">
          {APP_ASPECTS.map(tag => (
            <button
              key={tag}
              type="button"
              className={`rr-tag ${tags.includes(tag) ? 'rr-tag-active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tags.includes(tag) ? '✓ ' : ''}{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="rr-field">
        <label>Your Review <span className="rr-required">*</span></label>
        <textarea
          className="rr-textarea"
          rows={5}
          placeholder="Tell us about your experience with ServicePro — what worked great, what could be better…"
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={1000}
        />
        <span className="rr-char-count">{comment.length}/1000</span>
      </div>

      <button className="rr-submit-btn" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting…' : '⭐ Submit App Review'}
      </button>
    </div>
  );
}

/* ── My Reviews Tab ──────────────────────────────────────── */
function MyReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await appReviewApi.getMyReviews();
        if (res.success) setReviews(res.data);
        else setError(res.message || 'Failed to load reviews.');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load reviews.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="rr-state"><div className="rr-spinner" /><p>Loading…</p></div>;
  if (error) return <div className="rr-state rr-empty"><div className="rr-empty-icon">⚠️</div><p>{error}</p></div>;

  if (reviews.length === 0) {
    return (
      <div className="rr-state rr-empty">
        <div className="rr-empty-icon">💬</div>
        <p>You haven't reviewed the app yet.</p>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 8 }}>Switch to "Rate the App" to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="rr-reviews-list">
      {reviews.map(review => (
        <div key={review._id} className="rr-review-card">
          <div className="rr-review-header">
            <div className="rr-review-meta">
              <strong className="rr-provider-name">ServicePro App Review</strong>
              <span className="rr-service-tag">My Review</span>
            </div>
            <div className="rr-review-right">
              <StarRating value={review.rating} readonly size="sm" />
              <span className="rr-review-date">
                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <p className="rr-review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Community Tab ───────────────────────────────────────── */
function CommunityTab() {
  const [posts, setPosts] = useState(getPosts());
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  const handlePost = () => {
    if (!newTitle.trim() || !newBody.trim()) {
      setError('Please fill in both the title and description.');
      return;
    }
    setError('');
    const updated = [
      {
        id: Date.now().toString(),
        author: getCurrentUser(),
        title: newTitle.trim(),
        body: newBody.trim(),
        createdAt: new Date().toISOString(),
        replies: [],
        likes: 0,
      },
      ...posts,
    ];
    savePosts(updated);
    setPosts(updated);
    setNewTitle('');
    setNewBody('');
  };

  const handleReply = (postId) => {
    const text = replyInputs[postId]?.trim();
    if (!text) return;
    const updated = posts.map(p =>
      p.id === postId
        ? { ...p, replies: [...p.replies, { id: Date.now().toString(), author: getCurrentUser(), body: text, createdAt: new Date().toISOString() }] }
        : p
    );
    savePosts(updated);
    setPosts(updated);
    setReplyInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleLike = (postId) => {
    const updated = posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p);
    savePosts(updated);
    setPosts(updated);
  };

  const handleDelete = (postId) => {
    const updated = posts.filter(p => p.id !== postId);
    savePosts(updated);
    setPosts(updated);
  };

  return (
    <div className="rr-community">
      {/* New Post Form */}
      <div className="rr-community-form">
        <h3>Start a Discussion</h3>
        {error && <div className="rr-alert rr-alert-error">{error}<button onClick={() => setError('')}>✕</button></div>}
        <input
          ref={titleRef}
          className="rr-input"
          placeholder="Discussion title (e.g. Best plumbers in downtown?)"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <textarea
          className="rr-textarea"
          rows={3}
          placeholder="Share your experience, ask a question, or discuss a topic…"
          value={newBody}
          onChange={e => setNewBody(e.target.value)}
        />
        <button className="rr-submit-btn" onClick={handlePost}>📢 Post to Community</button>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="rr-state rr-empty">
          <div className="rr-empty-icon">🗣️</div>
          <p>No discussions yet. Be the first to start one!</p>
        </div>
      ) : (
        <div className="rr-posts-list">
          {posts.map(post => (
            <div key={post.id} className="rr-post-card">
              <div className="rr-post-header">
                <div className="rr-post-author-avatar">{post.author.charAt(0).toUpperCase()}</div>
                <div className="rr-post-author-info">
                  <strong>{post.author}</strong>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {post.author === getCurrentUser() && (
                  <button className="rr-delete-btn" onClick={() => handleDelete(post.id)} title="Delete">✕</button>
                )}
              </div>

              <h4 className="rr-post-title">{post.title}</h4>
              <p className="rr-post-body">{post.body}</p>

              <div className="rr-post-actions">
                <button className="rr-like-btn" onClick={() => handleLike(post.id)}>
                  👍 {post.likes || 0}
                </button>
                <span className="rr-reply-count">💬 {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}</span>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="rr-replies">
                  {post.replies.map(reply => (
                    <div key={reply.id} className="rr-reply">
                      <div className="rr-reply-avatar">{reply.author.charAt(0).toUpperCase()}</div>
                      <div className="rr-reply-content">
                        <strong>{reply.author}</strong>
                        <p>{reply.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="rr-reply-form">
                <input
                  className="rr-input rr-reply-input"
                  placeholder="Write a reply…"
                  value={replyInputs[post.id] || ''}
                  onChange={e => setReplyInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleReply(post.id); } }}
                />
                <button
                  className="rr-reply-send"
                  onClick={() => handleReply(post.id)}
                  disabled={!replyInputs[post.id]?.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function ReviewsRatings() {
  const [activeTab, setActiveTab] = useState('Rate the App');

  return (
    <>
      <UserNavbar />
      <div className="rr-root">
        {/* Page Header */}
        <div className="rr-page-header">
          <h1>Reviews &amp; Ratings</h1>
          <p>Rate the ServicePro app, view your reviews, and join the community</p>
        </div>

        {/* Tabs */}
        <div className="rr-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`rr-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Rate the App' && '⭐ '}
              {tab === 'My Reviews' && '📋 '}
              {tab === 'Community' && '🗣️ '}
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rr-panel">
          {activeTab === 'Rate the App' && <RateAppTab />}
          {activeTab === 'My Reviews' && <MyReviewsTab />}
          {activeTab === 'Community' && <CommunityTab />}
        </div>
      </div>
    </>
  );
}
