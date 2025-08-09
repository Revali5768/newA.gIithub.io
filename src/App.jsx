import React, { useEffect, useMemo, useState } from "react";

/**
 * NimbleNote AI — Single-file React SPA
 * - One-page marketing site + lightweight routes (/sales, /consulting, /pricing, /help, /entreprise, /legal/*)
 * - Tailwind CSS for styling
 * - Accessibility & SEO friendly
 */

// Design tokens via inline <style> (keeps it portable)
const Styles = () => (
  <style>{`
    :root{
      --bg:#F7F8FA;
      --ink:#0B0F1A;
      --muted:#5B6475;
      --card:#ffffff;
      --ring: #B9C1D6;
      --grad-a:#6B8CFF;
      --grad-b:#9B6BFF;
      --accent: linear-gradient(135deg,var(--grad-a),var(--grad-b));
    }
    .focus-ring:focus{outline:4px solid transparent; box-shadow:0 0 0 4px rgba(107,140,255,.35)}
    @keyframes fadeUp{from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)}}
    .fade-up{animation:fadeUp .6s ease both}
    @media (prefers-reduced-motion: reduce){
      .fade-up{animation:none}
      .motion-hover{transition:none}
    }
    .gradient-text{background:var(--accent); -webkit-background-clip:text; background-clip:text; color:transparent}
    .soft-shadow{box-shadow:0 6px 30px rgba(10,15,26,0.06)}
  `}</style>
);

// Minimal router
function useRoute(){
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, "") || "/");
  useEffect(()=>{
    const onPop = () => setPath(window.location.pathname.replace(/\/$/, "") || "/");
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  },[]);
  const navigate = (to) => {
    if(to === path) return;
    window.history.pushState({}, "", to);
    setPath(to);
    const main = document.querySelector('main');
    if(main) main.focus({preventScroll:true});
    window.scrollTo({top:0, behavior:'smooth'});
  };
  return { path, navigate };
}

// Primitives
const Container = ({ className = "", children }) => (
  <div className={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>{children}</div>
);

const Button = ({ as:Tag='a', href, onClick, children, variant='primary', className='', ariaLabel }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-2xl focus-ring motion-hover transition-transform active:translate-y-px px-5 py-3 text-sm font-semibold";
  const styles = variant === 'primary'
    ? "bg-[image:var(--accent)] text-white soft-shadow hover:opacity-95"
    : variant === 'ghost'
      ? "bg-transparent border border-[color:var(--ring)] text-[color:var(--ink)] hover:bg-white"
      : variant === 'link'
        ? "bg-transparent underline underline-offset-4 text-[color:var(--ink)] hover:opacity-80"
        : "bg-white text-[color:var(--ink)] border border-[color:var(--ring)] hover:bg-gray-50";
  return (
    <Tag href={href} onClick={onClick} aria-label={ariaLabel} className={`${base} ${styles} ${className}`}>
      {children}
    </Tag>
  );
};

const Pill = ({ children, className='' }) => (
  <span className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--ring)] bg-white/80 backdrop-blur px-3 py-1 text-xs text-[color:var(--muted)] ${className}`}>{children}</span>
);

// Original SVG icons
const IconSpark = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M12 2l2.2 5.1L19 9l-4.8 1.1L12 15l-2.2-4.9L5 9l4.8-1.9L12 2z" fill="url(#g)"/>
    <defs><linearGradient id="g" x1="0" y1="0" x2="24" y2="24"><stop stopColor="#6B8CFF"/><stop offset="1" stopColor="#9B6BFF"/></linearGradient></defs>
  </svg>
);
const IconNote = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="4" y="3" width="16" height="18" rx="3" fill="#fff" stroke="#9B6BFF"/>
    <path d="M8 8h8M8 12h8M8 16h5" stroke="#6B8CFF" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconQuestion = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" fill="#fff" stroke="#6B8CFF"/>
    <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.9.4-1.4 1-1.4 1.7" stroke="#9B6BFF" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill="#9B6BFF"/>
  </svg>
);
const IconMail = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="3" fill="#fff" stroke="#6B8CFF"/>
    <path d="M4 7l8 6 8-6" stroke="#9B6BFF" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="6.5" fill="#fff" stroke="#6B8CFF"/>
    <path d="M15.5 15.5L21 21" stroke="#9B6BFF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconKeyboard = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="3" y="7" width="18" height="10" rx="2" fill="#fff" stroke="#6B8CFF"/>
    <g fill="#9B6BFF"><rect x="5" y="9" width="2" height="2" rx=".5"/><rect x="8" y="9" width="2" height="2" rx=".5"/><rect x="11" y="9" width="2" height="2" rx=".5"/><rect x="14" y="9" width="2" height="2" rx=".5"/><rect x="17" y="9" width="2" height="2" rx=".5"/></g>
    <rect x="5" y="12.5" width="12" height="2" rx="1" fill="#6B8CFF"/>
  </svg>
);
const IconHistory = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" fill="#fff" stroke="#9B6BFF"/>
    <path d="M12 7v5l3 2" stroke="#6B8CFF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconLock = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="4" y="10" width="16" height="10" rx="2" fill="#fff" stroke="#6B8CFF"/>
    <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="#9B6BFF" strokeWidth="1.8"/>
    <circle cx="12" cy="15" r="1.8" fill="#9B6BFF"/>
  </svg>
);
const IconZap = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M13 2l-8 11h6l-1 9 9-12h-7l1-8z" fill="#6B8CFF"/>
  </svg>
);

// Mockups
const AssistantBubble = ({ label, hotkey }) => (
  <div className="flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur px-3 py-2 border border-[color:var(--ring)]">
    <span className="text-sm">{label}</span>
    {hotkey && <kbd aria-label={`Raccourci ${hotkey}`} className="ml-1 rounded-md border border-[color:var(--ring)] bg-[var(--bg)] px-1.5 py-0.5 text-[11px]">{hotkey}</kbd>}
  </div>
);

function MockupAssistant(){
  return (
    <figure className="relative w-full rounded-3xl border border-[color:var(--ring)] soft-shadow bg-white overflow-hidden" aria-label="Fenêtre d'assistant contextuel">
      <figcaption className="sr-only">Assistant qui propose des suggestions en direct</figcaption>
      <div className="flex items-center justify-between px-4 py-2 border-b border-[color:var(--ring)] bg-[var(--bg)]">
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <span className="w-2 h-2 rounded-full bg-[#ff5f56]"/><span className="w-2 h-2 rounded-full bg-[#ffbd2e]"/><span className="w-2 h-2 rounded-full bg-[#27c93f]"/>
          <span className="ml-2">NimbleNote AI — Assistance en direct</span>
        </div>
        <Pill>⚡ Temps réel</Pill>
      </div>
      <div className="grid md:grid-cols-[1fr_360px] gap-4 p-4">
        <div className="relative min-h-[220px] rounded-2xl bg-gradient-to-br from-[var(--grad-a)]/10 to-[var(--grad-b)]/10">
          <div className="absolute inset-0 p-4 grid gap-2 opacity-70">
            <div className="h-4 w-2/3 rounded bg-white/50"/>
            <div className="h-4 w-1/3 rounded bg-white/40"/>
            <div className="h-32 w-full rounded-xl bg-white/30"/>
            <div className="h-4 w-3/5 rounded bg-white/50"/>
          </div>
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <AssistantBubble label="Répondez : ‘Nous livrons vendredi à 10h’" hotkey="⌘⇧R"/>
            <AssistantBubble label="Proposer une objection douce" hotkey="⌘O"/>
            <AssistantBubble label="Ouvrir la fiche client" hotkey="⌘K"/>
          </div>
        </div>
        <aside className="rounded-2xl border border-[color:var(--ring)] bg-[var(--bg)] p-3">
          <div className="flex items-center justify-between mb-2">
            <Pill>🎤 Écoute active</Pill>
            <button className="text-xs underline underline-offset-4">Masquer</button>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-white soft-shadow">
              <p className="text-sm font-semibold">Suggestion rapide</p>
              <p className="text-sm text-[color:var(--muted)]">Expliquez le plan en 2 phrases et proposez une démo courte.</p>
            </div>
            <div className="p-3 rounded-xl bg-white">
              <p className="text-sm font-semibold">Points clés détectés</p>
              <ul className="text-sm text-[color:var(--muted)] list-disc pl-5">
                <li>Budget mentionné</li>
                <li>Doute sur la sécurité</li>
                <li>Décision avant vendredi</li>
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-white">
              <p className="text-sm font-semibold">Raccourcis</p>
              <div className="flex gap-2 flex-wrap">
                <AssistantBubble label="Résumer maintenant" hotkey="⌘S"/>
                <AssistantBubble label="Marquer à suivre" hotkey="⌘M"/>
                <AssistantBubble label="Envoyer email" hotkey="⌘E"/>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </figure>
  );
}

function MockupSummary(){
  return (
    <figure className="relative w-full rounded-3xl border border-[color:var(--ring)] bg-white soft-shadow overflow-hidden" aria-label="Résumé d'appel généré">
      <figcaption className="sr-only">Résumé d'appel avec tâches et e‑mail de suivi</figcaption>
      <div className="p-4 border-b border-[color:var(--ring)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconNote className="w-5 h-5"/>
          <strong>Résumé en 30 secondes</strong>
        </div>
        <Pill>📨 Brouillon d’e‑mail prêt</Pill>
      </div>
      <div className="p-4 grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-3 rounded bg-[var(--grad-a)]/20 w-4/5"/>
          <div className="h-3 rounded bg-[var(--grad-b)]/20 w-3/5"/>
          <div className="h-20 rounded-xl bg-gray-100"/>
          <div className="h-3 rounded bg-gray-200 w-2/3"/>
          <div className="h-3 rounded bg-gray-200 w-1/2"/>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[color:var(--ring)]">
            <p className="text-sm font-semibold">Actions</p>
            <ul className="text-sm text-[color:var(--muted)] list-disc pl-5">
              <li>Envoyer la proposition courte</li>
              <li>Planifier une démonstration de 15 min</li>
              <li>Confirmer le périmètre sécurité</li>
            </ul>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg)] border border-[color:var(--ring)]">
            <p className="text-sm font-semibold">E‑mail de suivi</p>
            <div className="h-16 rounded-lg bg-white"/>
          </div>
        </div>
      </div>
    </figure>
  );
}

const PlaceholderCapture = ({ label="Capture d’interface", seed=1 }) => (
  <figure className="relative w-full rounded-2xl border border-[color:var(--ring)] overflow-hidden bg-gradient-to-br from-[var(--grad-a)]/8 to-[var(--grad-b)]/8 soft-shadow" aria-label={label}>
    <div className="absolute inset-0 opacity-70">
      <div className="absolute -top-6 left-4 w-40 h-40 rounded-full blur-2xl" style={{background: 'var(--accent)'}}/>
      <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full blur-3xl" style={{background: 'var(--accent)', opacity:.4}}/>
    </div>
    <div className="relative p-5 grid gap-3">
      <div className="h-4 w-2/3 bg-white/70 rounded"/>
      <div className="h-28 bg-white/60 rounded-xl"/>
      <div className="flex gap-3">
        <div className="h-10 w-20 bg-white/70 rounded-lg"/>
        <div className="h-10 w-24 bg-white/70 rounded-lg"/>
      </div>
    </div>
    <figcaption className="sr-only">{label}</figcaption>
  </figure>
);

// Header & Footer
function Header({ navigate }){
  const handleNav = (e, to) => { e.preventDefault(); navigate(to); };
  const scrollToId = (e, id) => {
    e.preventDefault();
    if(window.location.pathname !== '/') navigate('/');
    requestAnimationFrame(()=>{
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  };
  return (
    <header role="banner" className="sticky top-0 z-40 backdrop-blur bg-[var(--bg)]/70 border-b border-[color:var(--ring)]">
      <Container className="flex items-center justify-between h-16">
        <a href="/" onClick={(e)=>handleNav(e,'/')} className="flex items-center gap-2 focus-ring" aria-label="Aller à l’accueil">
          <div className="font-black tracking-tight text-lg">
            <span className="gradient-text">Nimble</span><span>Note</span> <span className="text-[12px] align-top ml-1 px-1.5 py-0.5 rounded-md border border-[color:var(--ring)]">AI</span>
          </div>
        </a>
        <nav role="navigation" aria-label="Navigation principale" className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" onClick={(e)=>scrollToId(e,'features')} className="hover:opacity-80 focus-ring">Fonctionnalités</a>
          <a href="/pricing" onClick={(e)=>handleNav(e,'/pricing')} className="hover:opacity-80 focus-ring">Tarifs</a>
          <a href="/entreprise" onClick={(e)=>handleNav(e,'/entreprise')} className="hover:opacity-80 focus-ring">Entreprise</a>
          <a href="#faq" onClick={(e)=>scrollToId(e,'faq')} className="hover:opacity-80 focus-ring">FAQ</a>
          <a href="/help" onClick={(e)=>handleNav(e,'/help')} className="hover:opacity-80 focus-ring">Aide</a>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Button href="#download" onClick={(e)=>scrollToId(e,'download')} ariaLabel="Télécharger" variant="primary">Télécharger</Button>
        </div>
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer focus-ring rounded-lg px-3 py-2" aria-label="Ouvrir le menu">☰</summary>
          <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[color:var(--ring)] bg-white p-2 soft-shadow">
            <a href="#features" onClick={(e)=>{(e).preventDefault(); (e).currentTarget.closest('details').removeAttribute('open'); scrollToId(e,'features')}} className="block px-3 py-2 rounded-lg hover:bg-[var(--bg)]">Fonctionnalités</a>
            <a href="/pricing" onClick={(e)=>{(e).preventDefault(); (e).currentTarget.closest('details').removeAttribute('open'); navigate('/pricing')}} className="block px-3 py-2 rounded-lg hover:bg-[var(--bg)]">Tarifs</a>
            <a href="/entreprise" onClick={(e)=>{(e).preventDefault(); (e).currentTarget.closest('details').removeAttribute('open'); navigate('/entreprise')}} className="block px-3 py-2 rounded-lg hover:bg-[var(--bg)]">Entreprise</a>
            <a href="#faq" onClick={(e)=>{(e).preventDefault(); (e).currentTarget.closest('details').removeAttribute('open'); scrollToId(e,'faq')}} className="block px-3 py-2 rounded-lg hover:bg-[var(--bg)]">FAQ</a>
            <a href="/help" onClick={(e)=>{(e).preventDefault(); (e).currentTarget.closest('details').removeAttribute('open'); navigate('/help')}} className="block px-3 py-2 rounded-lg hover:bg-[var(--bg)]">Aide</a>
            <div className="border-t my-2"/>
            <Button as="button" onClick={(e)=>{(e).preventDefault(); (e).currentTarget.closest('details').removeAttribute('open'); scrollToId(e,'download')}} className="w-full">Télécharger</Button>
          </div>
        </details>
      </Container>
    </header>
  );
}

function Footer({ navigate }){
  const handleNav = (e, to) => { e.preventDefault(); navigate(to); };
  return (
    <footer role="contentinfo" className="mt-16 border-t border-[color:var(--ring)]">
      <Container className="py-10 grid md:grid-cols-5 gap-8 text-sm">
        <div className="md:col-span-2">
          <div className="font-black tracking-tight text-lg mb-2"><span className="gradient-text">Nimble</span><span>Note</span> <span className="text-[12px] align-top ml-1 px-1.5 py-0.5 rounded-md border border-[color:var(--ring)]">AI</span></div>
          <p className="text-[color:var(--muted)]">Assistant IA temps réel pour réunions et appels. Comprend l’écran et l’audio, vous souffle la bonne réponse au bon moment.</p>
          <div className="mt-4 flex gap-2">
            <Button href="#download" variant="primary">Télécharger</Button>
            <Button href="/entreprise" onClick={(e)=>handleNav(e,'/entreprise')} variant="ghost">Parler à l’équipe</Button>
          </div>
        </div>
        <div>
          <strong className="block mb-2">Produit</strong>
          <ul className="space-y-2 text-[color:var(--muted)]">
            <li><a className="hover:opacity-80" href="#features">Fonctionnalités</a></li>
            <li><a className="hover:opacity-80" href="/pricing" onClick={(e)=>handleNav(e,'/pricing')}>Tarifs</a></li>
            <li><a className="hover:opacity-80" href="/help" onClick={(e)=>handleNav(e,'/help')}>Aide</a></li>
          </ul>
        </div>
        <div>
          <strong className="block mb-2">Entreprise</strong>
          <ul className="space-y-2 text-[color:var(--muted)]">
            <li><a className="hover:opacity-80" href="/entreprise" onClick={(e)=>handleNav(e,'/entreprise')}>Contact</a></li>
            <li><a className="hover:opacity-80" href="/legal/terms" onClick={(e)=>handleNav(e,'/legal/terms')}>CGU</a></li>
            <li><a className="hover:opacity-80" href="/legal/privacy" onClick={(e)=>handleNav(e,'/legal/privacy')}>Confidentialité</a></li>
            <li><a className="hover:opacity-80" href="#lang">Langue</a></li>
          </ul>
        </div>
        <div>
          <strong className="block mb-2">Ressources</strong>
          <ul className="space-y-2 text-[color:var(--muted)]">
            <li><a className="hover:opacity-80" href="/sales" onClick={(e)=>handleNav(e,'/sales')}>Ventes</a></li>
            <li><a className="hover:opacity-80" href="/consulting" onClick={(e)=>handleNav(e,'/consulting')}>Consulting</a></li>
            <li><a className="hover:opacity-80" href="/help" onClick={(e)=>handleNav(e,'/help')}>Centre d’aide</a></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-[color:var(--ring)] py-6 text-xs text-center text-[color:var(--muted)]">
        © {new Date().getFullYear()} NimbleNote AI — Tous droits réservés.
      </div>
    </footer>
  );
}

// Sections
function Hero(){
  return (
    <section aria-labelledby="hero-heading" className="pt-10 md:pt-16">
      <Container>
        <div className="sr-only" id="top"/>
        <a className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-blue-400" href="#main">Aller au contenu</a>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5 fade-up">
            <h1 id="hero-heading" className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              L’IA qui souffle la bonne réponse, en direct
            </h1>
            <p className="text-lg text-[color:var(--muted)]">
              Analyse votre écran et votre audio pour vous aider pendant vos réunions, appels et démonstrations. Pas d’allers‑retours : l’assistant apparaît quand vous en avez besoin.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="#download">Télécharger pour Mac</Button>
              <Button href="#download" variant="ghost">Télécharger pour Windows</Button>
              <Button href="/pricing" variant="link">Voir les tarifs</Button>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Pill>⭐ Évaluations bêta</Pill>
              <Pill>🔒 Confidentialité d’abord</Pill>
              <Pill>⚡ Temps réel</Pill>
            </div>
          </div>
          <div className="fade-up">
            <MockupAssistant/>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Features(){
  const items = [
    {icon:IconNote, title:"Notes de réunion en temps réel", text:"Capture automatique et mise en forme des points clés pendant que vous parlez.", example:"Ex. ‘Décision vendredi, budget confirmé’."},
    {icon:IconQuestion, title:"Questions de relance et objections", text:"Recevez des propositions de relance adaptées au contexte pour garder le rythme.", example:"Ex. ‘Souhaitez‑vous valider les prochaines étapes ?’"},
    {icon:IconMail, title:"Résumé + e‑mail de suivi auto", text:"Obtenez un résumé clair et un brouillon d’e‑mail prêt à envoyer.", example:"Ex. tasks + agenda + lien de démo."},
    {icon:IconSearch, title:"Recherche contextuelle dans docs/écran", text:"Trouvez la réponse sans quitter votre fenêtre — l’assistant comprend ce que vous regardez.", example:"Ex. politique de sécu, grille tarifaire."},
    {icon:IconKeyboard, title:"Raccourcis clavier", text:"Déclenchez actions et modèles en un geste.", example:"Ex. ⌘S résumer, ⌘K ouvrir la fiche."},
    {icon:IconHistory, title:"Historique interrogeable", text:"Retrouvez une décision en une requête, par sujet, personne ou date.", example:"Ex. ‘contrat pilote mars’"},
  ];
  return (
    <section id="features" aria-labelledby="features-heading" className="mt-20">
      <Container>
        <h2 id="features-heading" className="text-2xl md:text-3xl font-extrabold mb-6">Fonctionnalités clés</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it, i)=> (
            <article key={i} className="rounded-2xl border border-[color:var(--ring)] bg-white p-5 soft-shadow fade-up" aria-label={it.title}>
              <div className="flex items-center gap-3 mb-3">
                <it.icon className="w-6 h-6"/>
                <h3 className="font-semibold">{it.title}</h3>
              </div>
              <p className="text-sm text-[color:var(--muted)]">{it.text}</p>
              <p className="text-xs mt-2 text-[color:var(--ink)]/70"><span className="gradient-text">Exemple</span> : {it.example}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function SocialProof(){
  return (
    <section className="mt-16" aria-label="Preuve sociale">
      <Container>
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="text-sm text-[color:var(--muted)]">
            Fiable pour des équipes modernes
            <div className="mt-3 flex flex-wrap items-center gap-4 opacity-80">
              {[1,2,3,4,5,6].map(i=> (
                <div key={i} aria-hidden className="h-8 w-24 rounded-md bg-gradient-to-tr from-[var(--grad-a)]/15 to-[var(--grad-b)]/15"/>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <figure className="p-3 rounded-xl bg-white border border-[color:var(--ring)] soft-shadow">
              <blockquote className="text-sm">« Moins d’hésitations, plus de réponses justes. On sent la différence dès le premier jour. »</blockquote>
              <figcaption className="text-xs text-[color:var(--muted)] mt-1">— Léa R., Responsable comptes</figcaption>
            </figure>
            <figure className="p-3 rounded-xl bg-white border border-[color:var(--ring)]">
              <blockquote className="text-sm">« Le résumé + e‑mail de suivi m’économise 15 min par appel. »</blockquote>
              <figcaption className="text-xs text-[color:var(--muted)] mt-1">— Malik A., Consultant</figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}

function UseCases(){
  const tabs = [
    {key:'sales', label:'Ventes', points:['Répondre aux objections avec tact','Aligner prix & périmètre en direct','Envoyer un récap clair après l’appel'], mock:<MockupAssistant/>},
    {key:'consulting', label:'Consulting', points:['Capturer décisions & risques','Garder le cap en atelier','Formaliser actions & responsabilités'], mock:<MockupSummary/>},
    {key:'internal', label:'Réunions internes', points:['Synthèse neutre des échanges','Suivi d’actions par équipe','Recherche facile dans l’historique'], mock:<MockupSummary/>},
    {key:'study', label:'Études', points:['Notes nettes pendant l’écoute','Référencer sources et extraits','Structurer les conclusions'], mock:<MockupAssistant/>},
  ];
  const [active, setActive] = useState('sales');
  return (
    <section className="mt-20" aria-labelledby="usecases-heading">
      <Container>
        <h2 id="usecases-heading" className="text-2xl md:text-3xl font-extrabold mb-6">Cas d’usage</h2>
        <div role="tablist" aria-label="Cas d’usage" className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.key} role="tab" aria-selected={active===t.key} onClick={()=>setActive(t.key)} className={`${active===t.key? 'bg-[image:var(--accent)] text-white' : 'bg-white text-[color:var(--ink)] border-[color:var(--ring)]'} px-4 py-2 rounded-full border`}>{t.label}</button>
          ))}
        </div>
        {tabs.map(t => (
          <div key={t.key} role="tabpanel" hidden={active!==t.key} className="grid md:grid-cols-2 gap-8 items-start fade-up">
            <ul className="space-y-3 text-[color:var(--muted)]">
              {t.points.map((p,i)=> <li key={i} className="flex items-start gap-2"><IconSpark className="w-4 h-4 mt-1"/><span>{p}</span></li>)}
              <div className="mt-6 flex gap-3">
                <Button href="/sales" as="a">Voir l’exemple</Button>
                <Button href="#download" variant="ghost">Essayer</Button>
              </div>
            </ul>
            <div className="min-h-[280px]">{t.mock}</div>
          </div>
        ))}
      </Container>
    </section>
  );
}

function Pricing(){
  const plans = [
    { name:'Gratuit', price:'0€', period:'/mois', cta:'Commencer', features:[
      'Réponses IA / jour limitées', 'Prise de notes illimitée', 'Prompt personnel', 'E‑mail de suivi'] },
    { name:'Pro', price:'19€', period:'/mois', highlight:true, cta:'Passer en Pro', features:[
      'Tout du Gratuit +', 'Réponses étendues', 'Intégrations (agenda, e‑mail, visioconférence)', 'Export & automatisations', 'Support prioritaire'] },
    { name:'Entreprise', price:'Sur devis', period:'', cta:'Parler à l’équipe', features:[
      'SSO & administration', 'Conformité & journalisation', 'Déploiement & MDM', 'SLA & support dédié'] },
  ];
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="mt-20">
      <Container>
        <h2 id="pricing-heading" className="text-2xl md:text-3xl font-extrabold mb-6">Tarifs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p,i)=> (
            <article key={i} className={`${p.highlight? 'border-transparent bg-[image:var(--accent)] text-white' : 'border-[color:var(--ring)] bg-white'} rounded-2xl border p-6 soft-shadow`} aria-label={`Offre ${p.name}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <div className="text-3xl font-extrabold">{p.price}<span className="text-sm font-medium">{p.period}</span></div>
              </div>
              <ul className={`mt-4 space-y-2 text-sm ${p.highlight? 'text-white/90' : 'text-[color:var(--muted)]'}`}>
                {p.features.map((f,j)=>(<li key={j} className="flex gap-2"><span>•</span><span>{f}</span></li>))}
              </ul>
              <div className="mt-6">
                <Button variant={p.highlight? 'ghost':'primary'} href="#download">{p.cta}</Button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Compliance(){
  return (
    <section aria-labelledby="compliance-heading" className="mt-20">
      <Container>
        <h2 id="compliance-heading" className="text-2xl md:text-3xl font-extrabold mb-4">Conformité & éthique</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <article className="rounded-2xl border border-[color:var(--ring)] bg-white p-5">
            <h3 className="font-semibold mb-1">Consentement explicite</h3>
            <p className="text-sm text-[color:var(--muted)]">Vous êtes responsable d’informer les participants avant tout enregistrement ou transcription. NimbleNote AI affiche un indicateur clair lorsque l’écoute est active.</p>
          </article>
          <article className="rounded-2xl border border-[color:var(--ring)] bg-white p-5">
            <h3 className="font-semibold mb-1">Contrôles de confidentialité</h3>
            <p className="text-sm text-[color:var(--muted)]">Désactivez l’audio à tout moment, excluez des applications, et choisissez le niveau de conservation. Les éléments sensibles peuvent être masqués côté client.</p>
          </article>
          <article className="rounded-2xl border border-[color:var(--ring)] bg-white p-5">
            <h3 className="font-semibold mb-1">Traitement local / serveur</h3>
            <p className="text-sm text-[color:var(--muted)]">Le traitement primaire s’effectue localement. Les requêtes vers le serveur sont chiffrées, limitées, et anonymisées pour l’amélioration du service, selon vos paramètres.</p>
          </article>
        </div>
      </Container>
    </section>
  );
}

function FAQ(){
  const faqs = [
    {q:'Comment l’assistant détecte‑t‑il le contexte ?', a:'Il combine la capture des éléments à l’écran (texte visible) et une écoute audio optionnelle, puis fait correspondre ces signaux à vos documents et modèles privés.'},
    {q:'Mes données sont‑elles en sécurité ?', a:'Oui. Les données locales restent sur votre ordinateur. Les appels réseau sont chiffrés, limités et paramétrables. Vous pouvez purger l’historique à tout moment.'},
    {q:'Quelles langues sont prises en charge ?', a:'Interface en français et anglais. Reconnaissance et génération multilingues pour la plupart des langues européennes majeures.'},
    {q:'Quelle est la précision ?', a:'L’assistant indique son niveau de confiance et vous laisse toujours valider avant d’envoyer. Vous gardez le dernier mot.'},
    {q:'Comment fonctionnent les intégrations ?', a:'Vous connectez vos outils (agenda, e‑mail, visioconférence, stockage) pour autoriser la recherche contextuelle et l’envoi de résumés.'},
    {q:'Quelles sont les conditions d’usage ?', a:'Usage professionnel autorisé dans le cadre légal applicable. Les enregistrements sans consentement sont interdits par défaut.'},
    {q:'Fonctionne‑t‑il hors ligne ?', a:'Les notes et certaines suggestions fonctionnent hors ligne. Les fonctionnalités avancées peuvent nécessiter une connexion.'},
  ];
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mt-20">
      <Container>
        <h2 id="faq-heading" className="text-2xl md:text-3xl font-extrabold mb-6">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((f,i)=> (
            <details key={i} className="rounded-2xl border border-[color:var(--ring)] bg-white p-4">
              <summary className="font-semibold cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FinalCTA(){
  return (
    <section id="download" aria-label="Appel à l’action final" className="mt-20">
      <Container>
        <div className="rounded-3xl border border-[color:var(--ring)] bg-white p-8 md:p-12 soft-shadow text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold">Commencez gratuitement aujourd’hui</h2>
          <p className="mt-2 text-[color:var(--muted)]">Installez NimbleNote AI et laissez l’assistant s’afficher quand il peut vous aider.</p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Button href="/downloads/NimbleNoteAI-mac.dmg">Télécharger pour Mac</Button>
            <Button href="/downloads/NimbleNoteAI-win.exe" variant="ghost">Télécharger pour Windows</Button>
            <Button href="/entreprise" variant="link">Parler à l’équipe</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Lightweight pages
const PageShell = ({ title, children }) => (
  <main id="main" tabIndex={-1} className="outline-none">
    <section className="pt-10 md:pt-16">
      <Container>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
        <div className="mt-6">{children}</div>
      </Container>
    </section>
  </main>
);

function PageSales(){
  return (
    <PageShell title="Ventes — Répondre juste, conclure vite">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <ul className="space-y-3 text-[color:var(--muted)]">
          <li className="flex gap-2"><IconSpark className="w-4 h-4 mt-1"/>Relances adaptées au ton de la discussion</li>
          <li className="flex gap-2"><IconSpark className="w-4 h-4 mt-1"/>Comparaisons et arguments prêts à l’emploi</li>
          <li className="flex gap-2"><IconSpark className="w-4 h-4 mt-1"/>Récap + e‑mail en 30 min</li>
        </ul>
        <MockupAssistant/>
      </div>
      <div className="mt-6 flex gap-3">
        <Button href="#download">Essayer</Button>
        <Button href="/pricing" variant="ghost">Voir les tarifs</Button>
      </div>
    </PageShell>
  );
}

function PageConsulting(){
  return (
    <PageShell title="Consulting — Clarifier, décider, documenter">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <ul className="space-y-3 text-[color:var(--muted)]">
          <li className="flex gap-2"><IconSpark className="w-4 h-4 mt-1"/>Capturer décisions, risques et hypothèses</li>
          <li className="flex gap-2"><IconSpark className="w-4 h-4 mt-1"/>Synthèse neutre & partage immédiat</li>
          <li className="flex gap-2"><IconSpark className="w-4 h-4 mt-1"/>Traçabilité des actions par personne</li>
        </ul>
        <MockupSummary/>
      </div>
      <div className="mt-6 flex gap-3">
        <Button href="#download">Essayer</Button>
        <Button href="/pricing" variant="ghost">Voir les tarifs</Button>
      </div>
    </PageShell>
  );
}

function PagePricing(){
  return (
    <PageShell title="Tarifs">
      <Pricing/>
    </PageShell>
  );
}

function PageHelp(){
  return (
    <PageShell title="Centre d’aide">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-3">
          <details className="rounded-2xl border border-[color:var(--ring)] bg-white p-4" open>
            <summary className="font-semibold">Installation (Mac & Windows)</summary>
            <ol className="mt-2 list-decimal pl-5 text-sm text-[color:var(--muted)]">
              <li>Téléchargez l’installateur.</li>
              <li>Autorisez l’accessibilité et le micro si nécessaire.</li>
              <li>Ouvrez une réunion ou un appel pour tester.</li>
            </ol>
          </details>
          <details className="rounded-2xl border border-[color:var(--ring)] bg-white p-4">
            <summary className="font-semibold">Confidentialité</summary>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Contrôlez l’écoute, l’exclusion d’applications et la rétention de données dans les paramètres.</p>
          </details>
          <details className="rounded-2xl border border-[color:var(--ring)] bg-white p-4">
            <summary className="font-semibold">Raccourcis utiles</summary>
            <ul className="mt-2 text-sm text-[color:var(--muted)] list-disc pl-5">
              <li>⌘S — Résumer</li>
              <li>⌘K — Ouvrir la fiche</li>
              <li>⌘E — Envoyer e‑mail</li>
            </ul>
          </details>
        </div>
        <div className="space-y-4">
          <PlaceholderCapture label="Capture paramètres"/>
          <PlaceholderCapture label="Capture suggestions" seed={2}/>
        </div>
      </div>
    </PageShell>
  );
}

function PageEntreprise(){
  return (
    <PageShell title="Entreprise — Déploiement & conformité">
      <p className="text-[color:var(--muted)] max-w-2xl">Gérez utilisateurs, politiques et intégrations à l’échelle. Déploiement silencieux, journalisation, SSO et assistance dédiée.</p>
      <form className="mt-6 grid md:grid-cols-2 gap-4 max-w-2xl" aria-label="Formulaire entreprise">
        <div className="flex flex-col gap-2">
          <label htmlFor="org" className="text-sm">Nom de l’entreprise</label>
          <input id="org" name="org" className="rounded-xl border border-[color:var(--ring)] bg-white px-3 py-2 focus-ring" placeholder="Ex. Acme SAS"/>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm">E‑mail professionnel</label>
          <input id="email" name="email" type="email" className="rounded-xl border border-[color:var(--ring)] bg-white px-3 py-2 focus-ring" placeholder="prenom@entreprise.fr"/>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="size" className="text-sm">Taille de l’équipe</label>
          <select id="size" name="size" className="rounded-xl border border-[color:var(--ring)] bg-white px-3 py-2 focus-ring">
            <option value="1-10">1–10</option>
            <option value="11-50">11–50</option>
            <option value="51-200">51–200</option>
            <option value=">200">+200</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="msg" className="text-sm">Message</label>
          <textarea id="msg" name="msg" rows={4} className="rounded-xl border border-[color:var(--ring)] bg-white px-3 py-2 focus-ring" placeholder="Décrivez vos besoins…"/>
        </div>
        <div className="md:col-span-2 flex gap-3">
          <Button as="button">Parler à l’équipe</Button>
          <Button as="button" variant="ghost">Télécharger la fiche PDF</Button>
        </div>
      </form>
    </PageShell>
  );
}

function PageTerms(){
  return (
    <PageShell title="Conditions Générales d’Utilisation (modèle)">
      <div className="prose max-w-none prose-p:my-2 prose-li:my-1">
        <p><strong>Dernière mise à jour :</strong> 9 août 2025</p>
        <h3>1. Objet</h3>
        <p>Ces conditions encadrent l’utilisation du logiciel « NimbleNote AI » (le « Service »). En l’utilisant, vous acceptez ces conditions.</p>
        <h3>2. Compte & éligibilité</h3>
        <p>Vous devez avoir l’âge légal pour conclure un contrat et fournir des informations exactes.</p>
        <h3>3. Licence</h3>
        <p>Licence non exclusive, non transférable, limitée à un usage professionnel dans le respect des lois applicables.</p>
        <h3>4. Contenu & confidentialité</h3>
        <p>Vous restez propriétaire de vos contenus. Vous autorisez le traitement nécessaire à la fourniture du Service, selon vos paramètres.</p>
        <h3>5. Enregistrements & consentement</h3>
        <p>Vous vous engagez à obtenir tout consentement requis avant enregistrement ou transcription de tiers.</p>
        <h3>6. Sécurité</h3>
        <p>Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables. Aucun système n’est parfaitement sûr.</p>
        <h3>7. Tarifs & facturation</h3>
        <p>Des offres gratuites et payantes sont proposées. Les prix peuvent évoluer avec préavis raisonnable.</p>
        <h3>8. Résiliation</h3>
        <p>Vous pouvez arrêter d’utiliser le Service à tout moment. Nous pouvons suspendre en cas de non‑respect des conditions.</p>
        <h3>9. Limitation de responsabilité</h3>
        <p>Dans la limite permise par la loi, la responsabilité totale est limitée aux montants payés sur les 12 derniers mois.</p>
        <h3>10. Droit applicable</h3>
        <p>Le droit applicable et la juridiction compétente seront définis lors de la contractualisation.</p>
      </div>
    </PageShell>
  );
}

function PagePrivacy(){
  return (
    <PageShell title="Politique de Confidentialité (modèle)">
      <div className="prose max-w-none prose-p:my-2 prose-li:my-1">
        <p><strong>Dernière mise à jour :</strong> 9 août 2025</p>
        <h3>1. Responsable du traitement</h3>
        <p>NimbleNote AI traite vos données pour fournir le Service et améliorer l’expérience utilisateur.</p>
        <h3>2. Données traitées</h3>
        <p>Données de compte, paramètres, contenu généré par l’utilisateur, signaux d’écran et audio (si activés), journaux techniques.</p>
        <h3>3. Finalités</h3>
        <p>Fourniture du Service, sécurité, assistance, statistiques agrégées, amélioration produit.</p>
        <h3>4. Base légale</h3>
        <p>Exécution du contrat, intérêt légitime, consentement lorsque requis (enregistrements, communications marketing).</p>
        <h3>5. Conservation</h3>
        <p>Durées proportionnées à la finalité. Options de purge immédiate à la demande.</p>
        <h3>6. Partage</h3>
        <p>Partage limité avec des sous‑traitants conformes. Pas de vente de données personnelles.</p>
        <h3>7. Sécurité</h3>
        <p>Chiffrement en transit, contrôle d’accès, audit périodique. Signalement des incidents selon les obligations applicables.</p>
        <h3>8. Vos droits</h3>
        <p>Accès, rectification, effacement, opposition, limitation, portabilité. Contactez‑nous via le Centre d’aide.</p>
      </div>
    </PageShell>
  );
}

// Home composition
function Home(){
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Hero/>
      <Features/>
      <SocialProof/>
      <UseCases/>
      <section className="mt-16" aria-label="Captures d’interface">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            <PlaceholderCapture label="Assistant flottant"/>
            <PlaceholderCapture label="Réponses contextuelles" seed={2}/>
            <PlaceholderCapture label="Paramètres de confidentialité" seed={3}/>
          </div>
        </Container>
      </section>
      <section className="mt-16" aria-label="Deuxième mockup">
        <Container>
          <MockupSummary/>
        </Container>
      </section>
      <Pricing/>
      <Compliance/>
      <FAQ/>
      <FinalCTA/>
    </main>
  );
}

// App (router)
export default function App(){
  const { path, navigate } = useRoute();
  const page = useMemo(()=>{
    switch(path){
      case '/sales': return <PageSales/>;
      case '/consulting': return <PageConsulting/>;
      case '/pricing': return <PagePricing/>;
      case '/help': return <PageHelp/>;
      case '/entreprise': return <PageEntreprise/>;
      case '/legal/terms': return <PageTerms/>;
      case '/legal/privacy': return <PagePrivacy/>;
      default: return <Home/>;
    }
  },[path]);

  useEffect(()=>{
    const clicks = (e) => {
      const a = e.target.closest('a');
      if(!a) return;
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        const id = href.slice(1);
        const el = document.getElementById(id);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
        }
      }
    };
    document.addEventListener('click', clicks);
    return ()=>document.removeEventListener('click', clicks);
  },[]);

  return (
    <div className="min-h-screen flex flex-col">
      <Styles/>
      <Header navigate={navigate}/>
      {page}
      <Footer navigate={navigate}/>
    </div>
  );
}
