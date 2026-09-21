import {
  Activity,
  ArrowUpRight,
  Check,
  Hand,
  Heart,
  MapPin,
  Plus,
  Sparkles,
  Waves,
} from "lucide-react";

export default function ProjectArt({ id }: { id: string }) {
  return (
    <div className={`project-art art-${id}`} aria-hidden="true">
      {id === "gym" && (
        <>
          <div className="gym-word">MOVE.</div>
          <div className="art-orbit" />
          <div className="gym-browser">
            <div className="mock-toolbar">
              <span>
                GymFlow
                <span className="mock-brand-dot" />
              </span>
              <i />
              <i />
              <i />
            </div>
            <div className="gym-interface">
              <div className="mock-sidebar">
                <b>G/</b>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="mock-content">
                <span className="mock-overline">YOUR GYM. IN SYNC.</span>
                <h4>
                  A stronger
                  <br />
                  day starts here.
                </h4>
                <div className="mock-stat-grid">
                  <div>
                    <small>MEMBERS</small>
                    <span>
                      Connected
                      <ArrowUpRight size={12} />
                    </span>
                  </div>
                  <div>
                    <small>PAYMENTS</small>
                    <span>
                      In one place
                      <Check size={12} />
                    </span>
                  </div>
                </div>
                <div className="mock-chart">
                  {[22, 35, 29, 47, 42, 55, 48, 64, 58, 75, 69, 84].map(
                    (h, i) => (
                      <i key={i} style={{ height: `${h}%` }} />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="gym-ticket">
            <Check size={17} />
            <div>
              <b>Everything. Connected.</b>
              <span>Members · Payments · Operations</span>
            </div>
          </div>
          <span className="art-corner">DESIGNED FOR THE EVERYDAY GRIND</span>
        </>
      )}
      {id === "palm" && (
        <>
          <div className="palm-rings">
            <i />
            <i />
            <i />
          </div>
          <div className="gesture-hand">
            <Hand size={158} strokeWidth={0.85} />
            <span className="gesture-dot gd-one" />
            <span className="gesture-dot gd-two" />
            <span className="gesture-dot gd-three" />
            <span className="gesture-dot gd-four" />
            <span className="gesture-dot gd-five" />
            <span className="gesture-sweep" />
          </div>
          <span className="palm-instruction">
            <span /> A LITTLE KITCHEN MAGIC.
          </span>
          <div className="recipe-card">
            <span>
              <Sparkles size={14} /> PALMCHEF AI
            </span>
            <h4>
              Good taste.
              <br />
              No touching.
            </h4>
            <div className="recipe-step">
              <b>01</b>
              <span>Gather your ingredients</span>
              <Check size={12} />
            </div>
            <div className="recipe-step">
              <b>02</b>
              <span>Let’s get cooking</span>
              <ArrowUpRight size={12} />
            </div>
            <div className="soundwave">
              {[12, 22, 34, 18, 29, 42, 26, 18, 34, 24, 12].map((h, i) => (
                <i
                  key={i}
                  style={{ height: h, animationDelay: `${i * -0.12}s` }}
                />
              ))}
              <small>I’m listening…</small>
            </div>
          </div>
          <span className="art-corner">GESTURE → RECIPE → VOICE</span>
        </>
      )}
      {id === "ocean" && (
        <>
          <svg
            className="ocean-lines"
            viewBox="0 0 600 440"
            preserveAspectRatio="xMidYMid slice"
          >
            {Array.from({ length: 19 }, (_, i) => (
              <path
                key={i}
                d={`M-50 ${i * 28 - 60} C120 ${i * 20 - 150} 290 ${i * 17 + 200} 400 ${i * 24 + 30} S600 ${i * 16 + 60} 700 ${i * 26 + 130}`}
              />
            ))}
          </svg>
          <span className="ocean-heading">
            A DIFFERENT
            <br />
            <b>DEPTH.</b>
          </span>
          <div className="float-buoy buoy-one">
            <i />
            <span>ARGO / 01</span>
          </div>
          <div className="float-buoy buoy-two">
            <i />
          </div>
          <div className="ocean-phone">
            <div className="phone-island" />
            <div className="ocean-phone-top">
              <Waves size={17} />
              <b>FloatChat</b>
              <Plus size={13} />
            </div>
            <small>DISCOVER WHAT’S BELOW.</small>
            <div className="phone-map">
              <span className="map-latitude" />
              <span className="map-longitude" />
              <MapPin size={26} />
              <span className="mini-map-point" />
            </div>
            <div className="ocean-data">
              <span>ARGO EXPLORER</span>
              <b>
                One ocean.
                <br />
                Endless discovery.
              </b>
              <div>
                <span>Maps</span>
                <span>Profiles</span>
                <span>Ask</span>
              </div>
            </div>
          </div>
          <span className="art-corner">OCEAN DATA. HUMAN CURIOSITY.</span>
        </>
      )}
      {id === "amedic" && (
        <>
          <div className="health-disc disc-back" />
          <div className="health-disc disc-front" />
          <span className="health-word">
            feel
            <br />
            <i>better.</i>
          </span>
          <div className="health-phone">
            <div className="phone-island" />
            <div className="health-greeting">
              <b>Good morning.</b>
              <Heart size={16} />
            </div>
            <span className="health-date">A LITTLE PROGRESS, EVERY DAY.</span>
            <div className="health-progress">
              <Activity size={24} />
              <b>Your pace.</b>
              <span>Your progress.</span>
            </div>
            <div className="wellness-grid">
              <div>
                <span>Move</span>
                <Activity size={16} />
              </div>
              <div>
                <span>Rest</span>
                <span>☾</span>
              </div>
            </div>
            <svg viewBox="0 0 180 50">
              <path
                d="M0 40 Q15 45 25 28 T52 29 T80 20 T107 25 T130 14 T157 15 T180 2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <small>MADE FOR A HEALTHIER YOU</small>
          </div>
          <span className="art-corner">HABITS → INSIGHTS → PROGRESS</span>
        </>
      )}
    </div>
  );
}
