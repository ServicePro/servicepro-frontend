import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import chatApi from "../../api/chatApi";
import UserNavbar from "../../components/userDashboard/UserNavbar";
import "./ChatPage.css";

const BASE_URL = "http://localhost:5000";
const POLL_INTERVAL = 4000; // ms between message polls

// ── Helpers ──────────────────────────────────────────────────────────────

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function groupByDate(messages) {
  const groups = {};
  messages.forEach((msg) => {
    const key = formatDate(msg.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
  });
  return groups;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function isImageUrl(url) {
  if (!url) return false;
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

// ── Component ─────────────────────────────────────────────────────────────

export default function ChatPage() {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  // ── State ────────────────────────────────────────────────────────────
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [inputError, setInputError] = useState("");

  const [threadsLoading, setThreadsLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState({
    providerId: "",
    userId: "",
    serviceName: "",
    bookingId: "",
  });
  const [newFormLoading, setNewFormLoading] = useState(false);

  // Provider dropdown state (inside New Conversation modal)
  const [allProviders, setAllProviders]         = useState([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Current user role from token (decode payload)
  const currentRole = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "user";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || "user";
    } catch {
      return "user";
    }
  })();

  // ── Load threads ──────────────────────────────────────────────────────
  const loadThreads = useCallback(async () => {
    try {
      const res = await chatApi.getThreads();
      if (res.success) setThreads(res.data || []);
    } catch {
      // ignore
    } finally {
      setThreadsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  // Auto-open thread from query param (e.g. /chat?threadId=xxx)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tid = params.get("threadId");
    if (tid) setActiveThreadId(tid);
  }, [location.search]);

  // ── Load active thread + start polling ────────────────────────────────
  const loadThread = useCallback(async (threadId, silent = false) => {
    if (!threadId) return;
    if (!silent) setMsgLoading(true);
    try {
      const res = await chatApi.getThread(threadId);
      if (res.success) {
        setActiveThread(res.data);
        setMessages(res.data.messages || []);
        // mark read silently
        chatApi.markRead(threadId).catch(() => {});
      }
    } catch {
      // ignore
    } finally {
      if (!silent) setMsgLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!activeThreadId) return;

    loadThread(activeThreadId);

    // Start polling for new messages
    pollingRef.current = setInterval(() => {
      loadThread(activeThreadId, true);
    }, POLL_INTERVAL);

    return () => clearInterval(pollingRef.current);
  }, [activeThreadId, loadThread]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Thread selection ──────────────────────────────────────────────────
  const selectThread = (threadId) => {
    if (threadId === activeThreadId) return;
    setActiveThreadId(threadId);
    setMessages([]);
    setInput("");
    setPendingFile(null);
    setInputError("");
  };

  // ── Send message ──────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!activeThreadId) return;
    if (!input.trim() && !pendingFile) {
      setInputError("Type a message or attach a file.");
      return;
    }
    setInputError("");
    setSending(true);

    try {
      if (pendingFile) {
        const res = await chatApi.uploadFile(activeThreadId, pendingFile);
        if (res.success) {
          setMessages((prev) => [...prev, res.data]);
          setPendingFile(null);
        }
      }
      if (input.trim()) {
        const res = await chatApi.sendMessage(activeThreadId, input);
        if (res.success) {
          setMessages((prev) => [...prev, res.data]);
          setInput("");
        }
      }
      // refresh thread list for updated lastMessage
      loadThreads();
    } catch (err) {
      setInputError(err?.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── File pick ─────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setInputError("File must be under 10 MB.");
      return;
    }
    setPendingFile(file);
    setInputError("");
    e.target.value = "";
  };

  // ── Load all approved providers when modal opens ─────────────────────
  const openNewModal = async () => {
    setShowNewModal(true);
    if (allProviders.length > 0) return; // already loaded
    setProvidersLoading(true);
    try {
      const res = await chatApi.searchProviders("");
      setAllProviders(res.data || []);
    } catch {
      setAllProviders([]);
    } finally {
      setProvidersLoading(false);
    }
  };

  const pickProvider = (providerId) => {
    const provider = allProviders.find((p) => p._id === providerId) || null;
    setSelectedProvider(provider);
    setNewForm((f) => ({ ...f, providerId }));
  };

  const resetModal = () => {
    setShowNewModal(false);
    setSelectedProvider(null);
    setNewForm({ providerId: "", userId: "", serviceName: "", bookingId: "" });
    setInputError("");
  };

  // ── New thread modal ──────────────────────────────────────────────────
  const handleCreateThread = async () => {
    if (currentRole === "user" && !newForm.providerId) {
      setInputError("Please select a provider.");
      return;
    }
    if (currentRole !== "user" && !newForm.userId) {
      setInputError("User ID is required.");
      return;
    }
    setNewFormLoading(true);
    try {
      const res = await chatApi.createThread(newForm);
      if (res.success) {
        resetModal();
        await loadThreads();
        setActiveThreadId(res.data._id);
      }
    } catch (err) {
      setInputError(err?.response?.data?.message || "Could not create thread.");
    } finally {
      setNewFormLoading(false);
    }
  };

  // ── Derived: other party name ─────────────────────────────────────────
  const otherName = (thread) => {
    if (!thread) return "";
    return currentRole === "provider" ? thread.userName : thread.providerName;
  };

  // ── Filter threads ────────────────────────────────────────────────────
  const filteredThreads = threads.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      otherName(t).toLowerCase().includes(q) ||
      t.serviceName?.toLowerCase().includes(q)
    );
  });

  // ── Grouped messages ──────────────────────────────────────────────────
  const grouped = groupByDate(messages);

  return (
    <>
      {currentRole === "user" && <UserNavbar />}
      <div className="chat-page">
      {/* ─── Left sidebar: thread list ─────────────────────────────── */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
          <div className="chat-search-box">
            <span className="chat-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <button className="chat-new-thread-btn" onClick={openNewModal}>
          ✉️ New Conversation
        </button>

        <div className="chat-thread-list">
          {threadsLoading ? (
            <div className="chat-loading">
              <div className="chat-spinner" /> Loading...
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="chat-empty-threads">
              <div className="empty-icon">💬</div>
              <p>No conversations yet.<br />Start a new one!</p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const name = otherName(thread);
              const unread =
                currentRole === "provider"
                  ? thread.unreadCountProvider
                  : thread.unreadCountUser;
              return (
                <div
                  key={thread._id}
                  className={`chat-thread-item ${activeThreadId === thread._id ? "active" : ""}`}
                  onClick={() => selectThread(thread._id)}
                >
                  <div className="chat-thread-avatar">{getInitials(name)}</div>
                  <div className="chat-thread-info">
                    <div className="chat-thread-name">{name}</div>
                    <div className="chat-thread-service">{thread.serviceName}</div>
                    <div className="chat-thread-preview">{thread.lastMessage || "Start a conversation"}</div>
                  </div>
                  <div className="chat-thread-meta">
                    <span className="chat-thread-time">
                      {thread.lastMessageAt ? formatTime(thread.lastMessageAt) : ""}
                    </span>
                    {unread > 0 && (
                      <span className="chat-unread-badge">{unread}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ─── Right panel: chat window ──────────────────────────────── */}
      <section className="chat-window">
        {!activeThreadId ? (
          <div className="chat-window-placeholder">
            <div className="placeholder-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose from your messages or start a new one.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            {activeThread && (
              <div className="chat-window-header">
                <div className="chat-thread-avatar">
                  {getInitials(otherName(activeThread))}
                </div>
                <div className="chat-header-info">
                  <p className="chat-header-name">{otherName(activeThread)}</p>
                  <p className="chat-header-service">
                    🔧 {activeThread.serviceName}
                    {activeThread.bookingId ? " · Booking" : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="chat-messages">
              {msgLoading ? (
                <div className="chat-loading">
                  <div className="chat-spinner" /> Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-empty-threads">
                  <div className="empty-icon">🙌</div>
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                Object.entries(grouped).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="chat-date-divider">
                      <span>{date}</span>
                    </div>
                    {msgs.map((msg) => {
                      const isSent = msg.senderRole === currentRole;
                      return (
                        <div
                          key={msg._id}
                          className={`chat-msg-row ${isSent ? "sent" : "received"}`}
                        >
                          <div className="chat-msg-avatar">
                            {getInitials(msg.senderName)}
                          </div>
                          <div className="chat-bubble-wrapper">
                            <div className="chat-bubble">
                              {/* Image */}
                              {msg.fileType === "image" && msg.fileUrl && (
                                <img
                                  className="chat-bubble-img"
                                  src={`${BASE_URL}${msg.fileUrl}`}
                                  alt={msg.fileName || "image"}
                                  onClick={() =>
                                    setLightboxSrc(`${BASE_URL}${msg.fileUrl}`)
                                  }
                                />
                              )}
                              {/* File */}
                              {msg.fileType === "file" && msg.fileUrl && (
                                <a
                                  className="chat-bubble-file"
                                  href={`${BASE_URL}${msg.fileUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <span className="chat-bubble-file-icon">📎</span>
                                  <span className="chat-bubble-file-name">
                                    {msg.fileName || "Download file"}
                                  </span>
                                </a>
                              )}
                              {/* Text */}
                              {msg.content && <span>{msg.content}</span>}
                            </div>
                            <span className="chat-bubble-time">
                              {formatTime(msg.createdAt)}
                              {isSent && msg.isRead ? " ✓✓" : isSent ? " ✓" : ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input error */}
            {inputError && <p className="chat-input-error">{inputError}</p>}

            {/* Input area */}
            <div className="chat-input-area">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />

              {/* Attach button */}
              <button
                className="chat-attach-btn"
                title="Attach file or image"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
              >
                📎
              </button>

              {/* Text + preview area */}
              <div className="chat-input-wrap">
                {pendingFile && (
                  <div className="chat-file-preview">
                    <span>
                      {isImageUrl(pendingFile.name) ? "🖼️" : "📄"}{" "}
                      {pendingFile.name.length > 20
                        ? `${pendingFile.name.slice(0, 18)}…`
                        : pendingFile.name}
                    </span>
                    <button onClick={() => setPendingFile(null)} title="Remove">✕</button>
                  </div>
                )}
                <textarea
                  rows={1}
                  placeholder="Type a message… (Enter to send)"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setInputError("");
                    // auto-resize
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                />
              </div>

              {/* Send button */}
              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={sending || (!input.trim() && !pendingFile)}
                title="Send"
              >
                {sending ? "⏳" : "➤"}
              </button>
            </div>
          </>
        )}
      </section>

      {/* ─── New thread modal ──────────────────────────────────────── */}
      {showNewModal && (
        <div className="chat-modal-overlay" onClick={resetModal}>
          <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chat-modal-header">
              <h3>New Conversation</h3>
              <button className="chat-modal-close" onClick={resetModal}>✕</button>
            </div>

            {currentRole === "user" ? (
              /* ── Provider dropdown ── */
              <div className="chat-modal-field">
                <label>Select Provider</label>
                {providersLoading ? (
                  <div className="chat-provider-loading">
                    <div className="chat-spinner" /> Loading providers…
                  </div>
                ) : (
                  <select
                    className="chat-provider-select"
                    value={newForm.providerId}
                    onChange={(e) => pickProvider(e.target.value)}
                  >
                    <option value="">— Choose a service provider —</option>
                    {allProviders.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}{p.category ? ` · ${p.category}` : ""}{p.area ? ` (${p.area})` : ""}
                      </option>
                    ))}
                  </select>
                )}

                {/* Selected provider info card */}
                {selectedProvider && (
                  <div className="chat-provider-selected">
                    <div className="chat-provider-selected-avatar">
                      {selectedProvider.name[0].toUpperCase()}
                    </div>
                    <div className="chat-provider-selected-info">
                      <span>{selectedProvider.name}</span>
                      <small>
                        {selectedProvider.category || "General"}
                        {selectedProvider.area ? ` · ${selectedProvider.area}` : ""}
                        {selectedProvider.rating ? ` · ⭐ ${selectedProvider.rating}` : ""}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Provider side: enter user ID ── */
              <div className="chat-modal-field">
                <label>User ID</label>
                <input
                  type="text"
                  placeholder="Enter user ID"
                  value={newForm.userId}
                  onChange={(e) => setNewForm({ ...newForm, userId: e.target.value })}
                />
              </div>
            )}

            <div className="chat-modal-field">
              <label>Service Name (optional)</label>
              <input
                type="text"
                placeholder="e.g. Plumbing, Cleaning…"
                value={newForm.serviceName}
                onChange={(e) => setNewForm({ ...newForm, serviceName: e.target.value })}
              />
            </div>

            {inputError && <p className="chat-modal-error">{inputError}</p>}

            <div className="chat-modal-actions">
              <button className="chat-modal-cancel" onClick={resetModal}>
                Cancel
              </button>
              <button
                className="chat-modal-submit"
                onClick={handleCreateThread}
                disabled={newFormLoading || (currentRole === "user" && !selectedProvider)}
              >
                {newFormLoading ? "Starting…" : "Start Chat →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Lightbox for full-size image ─────────────────────────── */}
      {lightboxSrc && (
        <div className="chat-lightbox" onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="Full size" />
        </div>
      )}
    </div>
    </>
  );
}
