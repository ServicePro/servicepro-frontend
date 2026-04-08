import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ERROR_MESSAGES = {
  email_exists: "This email is already registered. Please sign in with your password instead.",
  cancelled: "Sign-in was cancelled.",
  no_email:  "Could not retrieve your email from the provider. Please try another method.",
  token_failed: "Authentication failed. Please try again.",
  server_error: "A server error occurred. Please try again later."
};

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  // For ambiguous accounts (registered as both user and provider)
  const [ambiguous, setAmbiguous] = useState(false);
  const [pendingToken, setPendingToken] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  useEffect(() => {
    const hydrateAndRedirect = async () => {
      const token      = searchParams.get("token");
      const name       = searchParams.get("name");
      const role       = searchParams.get("role");
      const error      = searchParams.get("error");
      const isAmbig    = searchParams.get("ambiguous") === "1";
      const pToken     = searchParams.get("pendingToken");

      if (error) {
        const msg = ERROR_MESSAGES[error] || "Authentication failed.";
        navigate("/login", { state: { message: msg } });
        return;
      }

      // Account exists as both user and provider — show role selection
      if (isAmbig && pToken) {
        setDisplayName(name ? decodeURIComponent(name) : "");
        setPendingToken(pToken);
        setAmbiguous(true);
        setStatus("ready");
        return;
      }

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const user = {
            id: payload.id,
            role: role || payload.role || "user",
            name: name ? decodeURIComponent(name) : ""
          };

          localStorage.setItem("token", token);

          if (user.role === "provider") {
            try {
              const res = await fetch(`${API}/api/providers/me`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const data = await res.json();
              const provider = data?.data?.provider;
              if (res.ok && provider) {
                user.name = provider.name || user.name;
                user.email = provider.email || "";
                user.phone = provider.phone || "";
                user.category = provider.category || "";
                user.profile_image = provider.profile_image || null;
              }
            } catch {
              // Fall back to token/query payload if profile hydration fails.
            }
          }

          localStorage.setItem("user", JSON.stringify(user));
          navigate(user.role === "provider" ? "/provider/dashboard" : user.role === "admin" ? "/admin" : "/user-dashboard");
        } catch {
          setStatus("error");
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        navigate("/login", { state: { message: "Authentication failed. Please try again." } });
      }
    };

    hydrateAndRedirect();
  }, [navigate, searchParams]);

  const handleResolve = async (loginAs) => {
    setResolving(true);
    setResolveError("");
    try {
      const res = await fetch(`${API}/api/auth/social-resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pendingToken, loginAs })
      });
      const data = await res.json();
      if (!res.ok) {
        setResolveError(data.message || "Sign-in failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(loginAs === "provider" ? "/provider/dashboard" : "/user-dashboard");
    } catch {
      setResolveError("Network error. Please try again.");
    } finally {
      setResolving(false);
    }
  };

  if (status === "error") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "#ef4444" }}>Something went wrong. Redirecting to login...</p>
      </div>
    );
  }

  if (ambiguous) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "40px 36px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxWidth: "420px", width: "90%", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>👋</div>
          <h2 style={{ margin: "0 0 8px", color: "#1e293b", fontSize: "1.4rem" }}>Welcome back{displayName ? `, ${displayName}` : ""}!</h2>
          <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "0.95rem", lineHeight: "1.5" }}>
            Your account is registered as both a <strong>User</strong> and a <strong>Service Provider</strong>.<br />
            How would you like to continue?
          </p>
          {resolveError && (
            <p style={{ color: "#ef4444", fontSize: "0.88rem", marginBottom: "12px" }}>{resolveError}</p>
          )}
          <button
            onClick={() => handleResolve("user")}
            disabled={resolving}
            style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", background: "#f97316", color: "#fff", fontWeight: "700", fontSize: "1rem", cursor: "pointer", marginBottom: "12px", opacity: resolving ? 0.7 : 1 }}
          >
            Continue as User
          </button>
          <button
            onClick={() => handleResolve("provider")}
            disabled={resolving}
            style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "2px solid #f97316", background: "#fff", color: "#f97316", fontWeight: "700", fontSize: "1rem", cursor: "pointer", marginBottom: "16px", opacity: resolving ? 0.7 : 1 }}
          >
            Continue as Service Provider
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "0.85rem", cursor: "pointer" }}
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", gap: "12px" }}>
      <div style={{ width: "36px", height: "36px", border: "4px solid #e5e7eb", borderTop: "4px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#6b7280", fontSize: "15px" }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

