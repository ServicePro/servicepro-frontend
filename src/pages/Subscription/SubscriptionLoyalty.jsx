import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import subscriptionApi from '../../api/subscriptionApi';
import './SubscriptionLoyalty.css';

const TABS = ['Plans', 'Loyalty Points', 'Redeem Rewards'];

const TIER_CONFIG = [
  { name: 'Bronze',   min: 0,    max: 299,  color: '#cd7f32', icon: '🥉' },
  { name: 'Silver',   min: 300,  max: 699,  color: '#9ca3af', icon: '🥈' },
  { name: 'Gold',     min: 700,  max: 1499, color: '#f59e0b', icon: '🥇' },
  { name: 'Platinum', min: 1500, max: Infinity, color: '#7c3aed', icon: '💎' },
];

function getTier(points) {
  return TIER_CONFIG.find((t) => points >= t.min && points <= t.max) || TIER_CONFIG[0];
}

function TierProgress({ points }) {
  const tier = getTier(points);
  const next = TIER_CONFIG[TIER_CONFIG.indexOf(tier) + 1];
  const pct = next ? Math.min(100, ((points - tier.min) / (next.min - tier.min)) * 100) : 100;

  return (
    <div className="sl-tier-card">
      <div className="sl-tier-icon" style={{ background: tier.color + '22', border: `2px solid ${tier.color}` }}>
        <span style={{ fontSize: '2.5rem' }}>{tier.icon}</span>
      </div>
      <div className="sl-tier-info">
        <p className="sl-tier-name" style={{ color: tier.color }}>{tier.name} Member</p>
        <p className="sl-tier-pts"><strong>{points.toLocaleString()}</strong> loyalty points</p>
        {next ? (
          <>
            <div className="sl-progress-bar">
              <div className="sl-progress-fill" style={{ width: `${pct}%`, background: tier.color }} />
            </div>
            <p className="sl-tier-next">
              {(next.min - points).toLocaleString()} pts to {next.name} {
                TIER_CONFIG[TIER_CONFIG.indexOf(next)]?.icon
              }
            </p>
          </>
        ) : (
          <p className="sl-tier-next" style={{ color: '#7c3aed' }}>🎉 Maximum tier reached!</p>
        )}
      </div>
    </div>
  );
}

export default function SubscriptionLoyalty() {
  const [activeTab, setActiveTab] = useState('Plans');
  const [plans, setPlans] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const [redeeming, setRedeeming] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        const [plansRes, rewardsRes, subRes] = await Promise.all([
          subscriptionApi.getPlans(),
          subscriptionApi.getRewards(),
          subscriptionApi.getMy(),
        ]);
        setPlans(plansRes.data?.data || []);
        setRewards(rewardsRes.data?.data || []);
        setSubscription(subRes.data?.data || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const navigate = useNavigate();

  const handleSubscribe = async (planId) => {
    const plan = plans.find((p) => p.id === planId);
    // Free plan — activate directly without payment
    if (!plan || plan.price === 0) {
      setSubscribing(planId);
      try {
        const res = await subscriptionApi.subscribe(planId);
        setSubscription(res.data?.data);
        showToast(res.data?.message || 'Plan activated!');
      } catch (e) {
        showToast(e.response?.data?.message || 'Subscription failed', 'error');
      } finally {
        setSubscribing(null);
      }
      return;
    }
    // Paid plan — go to checkout
    navigate(
      `/checkout?type=subscription` +
      `&id=${planId}` +
      `&amount=${plan.price}` +
      `&label=${encodeURIComponent(plan.name + ' Plan')}` +
      `&sublabel=${encodeURIComponent('Monthly subscription • Cancel anytime')}`
    );
  };

  const handleRedeem = async (rewardId) => {
    setRedeeming(rewardId);
    try {
      const res = await subscriptionApi.redeem(rewardId);
      setSubscription(res.data?.data);
      showToast(res.data?.message || 'Reward redeemed! It will be applied on your next payment.');
    } catch (e) {
      showToast(e.response?.data?.message || 'Redemption failed', 'error');
    } finally {
      setRedeeming(null);
    }
  };

  const currentPlan = subscription?.plan || 'free';
  const loyaltyPoints = subscription?.loyaltyPoints || 0;
  const pointsHistory = subscription?.pointsHistory || [];

  return (
    <>
      <UserNavbar />
      <div className="sl-root">
        {toast && (
          <div className={`sl-toast sl-toast-${toast.type}`}>{toast.msg}</div>
        )}

        <div className="sl-page-header">
          <div>
            <h1>Subscription &amp; Loyalty</h1>
            <p>Manage your plan and earn rewards with every booking</p>
          </div>
          {subscription && (
            <div className="sl-current-plan-badge" data-plan={currentPlan}>
              {currentPlan.toUpperCase()} PLAN
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="sl-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`sl-tab${activeTab === t ? ' sl-tab-active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'Plans' && '📋 '}
              {t === 'Loyalty Points' && '⭐ '}
              {t === 'Redeem Rewards' && '🎁 '}
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="sl-loading"><div className="sl-spinner" />Loading...</div>
        ) : (
          <>
            {/* ── PLANS TAB ─────────────────────────────── */}
            {activeTab === 'Plans' && (
              <div className="sl-plans-grid">
                {plans.map((plan) => {
                  const isActive = currentPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      className={`sl-plan-card${isActive ? ' sl-plan-active' : ''}`}
                      style={{ '--plan-color': plan.color }}
                    >
                      {plan.badge && (
                        <div className="sl-plan-badge">{plan.badge}</div>
                      )}
                      <div className="sl-plan-header">
                        <h2 className="sl-plan-name">{plan.name}</h2>
                        <div className="sl-plan-price">
                          <span className="sl-price-amount">
                            {plan.price === 0 ? 'Free' : `$${plan.price}`}
                          </span>
                          {plan.price > 0 && (
                            <span className="sl-price-billing">{plan.billing}</span>
                          )}
                        </div>
                        <p className="sl-plan-tagline">
                          {plan.price === 0
                            ? 'For regular booking users — no payment needed'
                            : 'Requires payment · Cancel anytime'}
                        </p>
                      </div>

                      <ul className="sl-feature-list">
                        {plan.features.map((f) => (
                          <li key={f} className="sl-feature-included">✅ {f}</li>
                        ))}
                        {plan.excluded.map((f) => (
                          <li key={f} className="sl-feature-excluded">❌ {f}</li>
                        ))}
                      </ul>

                      <button
                        className={`sl-plan-btn${isActive ? ' sl-plan-btn-active' : ''}`}
                        style={{ background: isActive ? '#e2e8f0' : plan.color }}
                        disabled={isActive || subscribing === plan.id}
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        {subscribing === plan.id
                          ? 'Processing...'
                          : isActive
                          ? '✓ Current Plan'
                          : plan.price === 0
                          ? '🚀 Get Started — Free'
                          : `💳 Subscribe & Pay $${plan.price}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── LOYALTY POINTS TAB ──────────────────────── */}
            {activeTab === 'Loyalty Points' && (
              <div className="sl-loyalty-root">
                <TierProgress points={loyaltyPoints} />

                <div className="sl-earn-grid">
                  {[
                    { icon: '📅', label: 'Book a Service',  pts: '+10 pts' },
                    { icon: '⭐', label: 'Leave a Review',   pts: '+5 pts'  },
                    { icon: '👥', label: 'Refer a Friend',   pts: '+50 pts' },
                    { icon: '🔄', label: 'Rebook Provider',  pts: '+8 pts'  },
                    { icon: '💳', label: 'Upgrade Plan',     pts: '+bonus'  },
                    { icon: '📆', label: 'Monthly Streak',   pts: '+25 pts' },
                  ].map((e) => (
                    <div className="sl-earn-card" key={e.label}>
                      <span className="sl-earn-icon">{e.icon}</span>
                      <p className="sl-earn-label">{e.label}</p>
                      <p className="sl-earn-pts">{e.pts}</p>
                    </div>
                  ))}
                </div>

                <div className="sl-history-section">
                  <h3>Points History</h3>
                  {pointsHistory.length === 0 ? (
                    <div className="sl-empty">No points history yet. Start booking to earn!</div>
                  ) : (
                    <table className="sl-history-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...pointsHistory].reverse().map((h, i) => (
                          <tr key={i}>
                            <td>{new Date(h.date).toLocaleDateString()}</td>
                            <td>{h.description}</td>
                            <td className={h.type === 'earned' ? 'sl-pts-earned' : 'sl-pts-redeemed'}>
                              {h.type === 'earned' ? '+' : ''}{h.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ── REDEEM REWARDS TAB ──────────────────────── */}
            {activeTab === 'Redeem Rewards' && (
              <div className="sl-redeem-root">
                <div className="sl-points-banner">
                  <span className="sl-points-big">⭐ {loyaltyPoints.toLocaleString()}</span>
                  <span className="sl-points-label">Available Points</span>
                </div>

                {/* Pending reward notice */}
                {subscription?.pendingReward?.rewardId && (
                  <div className="sl-pending-reward-notice">
                    <span className="sl-pending-icon">🎁</span>
                    <div>
                      <p className="sl-pending-title">Reward Ready: <strong>{subscription.pendingReward.title}</strong></p>
                      <p className="sl-pending-sub">
                        This reward will be automatically applied on your next booking or emergency payment.
                      </p>
                    </div>
                  </div>
                )}

                <div className="sl-rewards-grid">
                  {rewards.map((r) => {
                    const canAfford = loyaltyPoints >= r.pointsCost;
                    return (
                      <div
                        key={r.id}
                        className={`sl-reward-card${!canAfford ? ' sl-reward-locked' : ''}`}
                      >
                        <div className="sl-reward-icon">
                          {r.type === 'discount'     && '🏷️'}
                          {r.type === 'free_service'  && '🎁'}
                          {r.type === 'priority'      && '⚡'}
                          {r.type === 'credit'        && '💳'}
                        </div>
                        <h3 className="sl-reward-title">{r.title}</h3>
                        <p className="sl-reward-value">{r.value}</p>
                        <div className="sl-reward-cost">
                          <span>⭐ {r.pointsCost} pts</span>
                        </div>
                        <button
                          className="sl-reward-btn"
                          disabled={!canAfford || redeeming === r.id}
                          onClick={() => handleRedeem(r.id)}
                        >
                          {redeeming === r.id
                            ? 'Redeeming...'
                            : !canAfford
                            ? `Need ${r.pointsCost - loyaltyPoints} more pts`
                            : 'Redeem Now'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
