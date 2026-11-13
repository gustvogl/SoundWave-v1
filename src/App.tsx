import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Search,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Bookmark,
  Compass,
  Sparkles,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

interface Episode {
  id: number;
  title: string;
  author: string;
  institution: string;
  category: string;
  durationSec: number;
  gradient: string;
  code: string;
  abstract: string;
  freqBase: number;
}

const EPISODES: Episode[] = [
  {
    id: 1,
    title: 'Arquitetura Mobile Híbrida e Capacitor Nativo',
    author: 'Prof. Adriano Mazetto',
    institution: 'FATEC • PPDM2',
    category: 'Computação',
    durationSec: 1845,
    gradient: 'linear-gradient(135deg, #9333ea, #4c1d95)',
    code: 'CS-101',
    abstract:
      'Discussão técnica sobre integração de WebViews modernas com recursos nativos Android, geração automatizada de assets e pipelines CI/CD.',
    freqBase: 220,
  },
  {
    id: 2,
    title: 'LLMs e Raciocínio Causal em Engenharia de Software',
    author: 'Dra. Helena Vasconcelos',
    institution: 'USP • ICMC',
    category: 'IA & Dados',
    durationSec: 2410,
    gradient: 'linear-gradient(135deg, #7c3aed, #1e1b4b)',
    code: 'IA-402',
    abstract:
      'Análise empírica sobre geração assistida de código, verificação formal e benchmarks de agentes autônomos em produção.',
    freqBase: 261.63,
  },
  {
    id: 3,
    title: 'Metodologia Científica e Revisão Sistemática',
    author: 'Prof. Dr. Marcos Almeida',
    institution: 'UNICAMP',
    category: 'Pesquisa',
    durationSec: 1520,
    gradient: 'linear-gradient(135deg, #a855f7, #3b0764)',
    code: 'MT-205',
    abstract:
      'Guia prático para estruturação de protocolos PRISMA, strings de busca em bases acadêmicas e síntese de evidências.',
    freqBase: 293.66,
  },
  {
    id: 4,
    title: 'Computação Quântica e Criptografia Pós-Quântica',
    author: 'Núcleo de Física Teórica',
    institution: 'UNESP',
    category: 'Física',
    durationSec: 2980,
    gradient: 'linear-gradient(135deg, #6d28d9, #172554)',
    code: 'FQ-310',
    abstract:
      'Impacto dos algoritmos de Shor e Grover sobre RSA/ECC e a padronização NIST de algoritmos baseados em reticulados.',
    freqBase: 329.63,
  },
  {
    id: 5,
    title: 'Sistemas Distribuídos de Baixa Latência',
    author: 'Lab Sistemas Escaláveis',
    institution: 'ITA',
    category: 'Computação',
    durationSec: 2115,
    gradient: 'linear-gradient(135deg, #8b5cf6, #311042)',
    code: 'SD-508',
    abstract:
      'Consenso Raft, replicação multi-região e estratégias de tolerância a falhas em arquiteturas orientadas a eventos.',
    freqBase: 349.23,
  },
];

const CATEGORIES = ['Todos', 'Computação', 'IA & Dados', 'Pesquisa', 'Física'];
const SPEEDS = [1, 1.25, 1.5, 2];

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'saved'>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentEp, setCurrentEp] = useState<Episode>(EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(142);
  const [speedIdx, setSpeedIdx] = useState<number>(0);
  const [savedIds, setSavedIds] = useState<number[]>([1, 2]);
  const [showFullPlayer, setShowFullPlayer] = useState<boolean>(false);

  // Web Audio API para som ambiente sutil quando o usuário dá play
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(currentEp.freqBase, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
      } catch {
        // Ignora caso o navegador bloqueie áudio sem gesto
      }
    } else if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // noop
      }
      oscRef.current = null;
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch {
          // noop
        }
      }
    };
  }, [isPlaying, currentEp]);

  // Avanço real do tempo de reprodução
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + SPEEDS[speedIdx] >= currentEp.durationSec) {
          setIsPlaying(false);
          return 0;
        }
        return prev + SPEEDS[speedIdx];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, speedIdx, currentEp]);

  const handleSelectEpisode = (ep: Episode) => {
    if (currentEp.id === ep.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentEp(ep);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    const idx = EPISODES.findIndex((e) => e.id === currentEp.id);
    const next = EPISODES[(idx + 1) % EPISODES.length];
    setCurrentEp(next);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const idx = EPISODES.findIndex((e) => e.id === currentEp.id);
    const prev = EPISODES[(idx - 1 + EPISODES.length) % EPISODES.length];
    setCurrentEp(prev);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const filteredEpisodes = EPISODES.filter((ep) => {
    const matchesTab = activeTab === 'explore' || savedIds.includes(ep.id);
    const matchesCat = selectedCategory === 'Todos' || ep.category === selectedCategory;
    const matchesSearch =
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.institution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCat && matchesSearch;
  });

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="top-header">
        <div className="brand-group">
          <div className="brand-icon">
            <Radio size={22} color="#FFFFFF" />
          </div>
          <div className="brand-text">
            <h1>SoundWave</h1>
            <span>Academic Audio</span>
          </div>
        </div>
        <div className="badge-academic">PPDM2 • PRO</div>
      </header>

      {/* Search */}
      <div className="search-box">
        <Search size={17} />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar artigos, docentes ou temas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="categories-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Hero Card (only on Explore tab without search) */}
      {activeTab === 'explore' && !searchQuery && (
        <section className="hero-card">
          <div className="hero-tag">
            <Sparkles size={13} /> DESTAQUE DA SEMANA
          </div>
          <h2>{EPISODES[0].title}</h2>
          <p>
            {EPISODES[0].author} • {EPISODES[0].institution}
          </p>
          <div className="hero-footer">
            <button className="hero-play-btn" onClick={() => handleSelectEpisode(EPISODES[0])}>
              {currentEp.id === EPISODES[0].id && isPlaying ? (
                <>
                  <Pause size={16} /> Pausar Episódio
                </>
              ) : (
                <>
                  <Play size={16} /> Ouvir Agora ({formatTime(EPISODES[0].durationSec)})
                </>
              )}
            </button>
            <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>
              {EPISODES[0].code}
            </span>
          </div>
        </section>
      )}

      {/* Episode List */}
      <div className="section-header">
        <h3>{activeTab === 'explore' ? 'Acervo Acadêmico' : 'Minha Biblioteca Salva'}</h3>
        <span>{filteredEpisodes.length} episódios</span>
      </div>

      <div className="episodes-list">
        {filteredEpisodes.map((ep) => {
          const isCurrent = currentEp.id === ep.id;
          const isSaved = savedIds.includes(ep.id);
          return (
            <div
              key={ep.id}
              className={`ep-card ${isCurrent ? 'playing' : ''}`}
              onClick={() => handleSelectEpisode(ep)}
            >
              <div className="ep-cover" style={{ background: ep.gradient }}>
                {ep.code}
              </div>

              <div className="ep-content">
                <div className="ep-meta-top">
                  <span className="ep-area">{ep.category}</span>
                  {isCurrent && isPlaying && (
                    <div className="eq-bars">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </div>
                <div className="ep-title">{ep.title}</div>
                <div className="ep-sub">
                  {ep.author} • {formatTime(ep.durationSec)}
                </div>
              </div>

              <div className="ep-actions">
                <button
                  className={`icon-btn ${isSaved ? 'liked' : ''}`}
                  onClick={(e) => toggleSave(e, ep.id)}
                  aria-label="Salvar episódio"
                >
                  <Heart size={18} fill={isSaved ? '#f43f5e' : 'none'} />
                </button>
                <button className="circle-play" aria-label="Reproduzir">
                  {isCurrent && isPlaying ? <Pause size={17} /> : <Play size={17} />}
                </button>
              </div>
            </div>
          );
        })}

        {filteredEpisodes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 12px', color: '#71717a', fontSize: '0.85rem' }}>
            Nenhum podcast encontrado para esse filtro.
          </div>
        )}
      </div>

      {/* Floating Mini Player */}
      <div className="mini-player">
        <div className="mini-top">
          <div className="mini-info" onClick={() => setShowFullPlayer(true)}>
            <h4>{currentEp.title}</h4>
            <p>
              {currentEp.author} • {currentEp.institution}
            </p>
          </div>

          <div className="mini-controls">
            <button
              className="speed-badge"
              onClick={() => setSpeedIdx((prev) => (prev + 1) % SPEEDS.length)}
            >
              {SPEEDS[speedIdx]}x
            </button>
            <button className="mini-play-btn" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button className="icon-btn" onClick={handleNext}>
              <SkipForward size={18} />
            </button>
          </div>
        </div>

        <div className="progress-row">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            className="progress-bar"
            min={0}
            max={currentEp.durationSec}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
          />
          <span>{formatTime(currentEp.durationSec)}</span>
        </div>
      </div>

      {/* Fullscreen Player Modal */}
      {showFullPlayer && (
        <div className="modal-overlay">
          <div className="modal-header">
            <button className="icon-btn" onClick={() => setShowFullPlayer(false)}>
              <ChevronDown size={26} color="#fff" />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              TOCANDO AGORA
            </span>
            <button
              className="speed-badge"
              onClick={() => setSpeedIdx((prev) => (prev + 1) % SPEEDS.length)}
            >
              {SPEEDS[speedIdx]}x
            </button>
          </div>

          <div>
            <div className="modal-art" style={{ background: currentEp.gradient }}>
              <Radio size={54} color="#fff" />
              <span style={{ fontWeight: 800, letterSpacing: '0.06em' }}>{currentEp.code}</span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span className="ep-area">{currentEp.category} • {currentEp.institution}</span>
              <h2 style={{ fontSize: '1.2rem', marginTop: '6px', marginBottom: '4px' }}>
                {currentEp.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{currentEp.author}</p>
            </div>

            <div className="abstract-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: 700, marginBottom: '4px' }}>
                <BookOpen size={14} /> Resumo Acadêmico (Abstract)
              </div>
              {currentEp.abstract}
            </div>
          </div>

          <div>
            <div className="progress-row" style={{ marginBottom: '12px' }}>
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                className="progress-bar"
                min={0}
                max={currentEp.durationSec}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
              />
              <span>{formatTime(currentEp.durationSec)}</span>
            </div>

            <div className="modal-controls">
              <button className="icon-btn" onClick={handlePrev}>
                <SkipBack size={28} color="#fff" />
              </button>
              <button className="modal-play-big" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={28} /> : <Play size={28} />}
              </button>
              <button className="icon-btn" onClick={handleNext}>
                <SkipForward size={28} color="#fff" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <Compass size={20} />
          <span>Explorar</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={20} />
          <span>Biblioteca ({savedIds.length})</span>
        </button>
      </nav>
    </div>
  );
}
