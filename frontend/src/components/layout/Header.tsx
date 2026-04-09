import logoFucs from '@/assets/logo-fucs.png'

interface HeaderProps {
  onNewCase: () => void
  onAbout: () => void
}

export default function Header({ onNewCase, onAbout }: HeaderProps) {
  return (
    <header className="glass-header fixed top-0 w-full z-50 h-16 flex items-center justify-between px-8 shadow-deep">
      {/* Left: brand + nav */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black text-on-surface tracking-tight font-headline">
            ProfundaMente
          </span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-label mt-0.5">
            Tutor de Patrones de Adenocarcinoma de Pulmón
          </span>
        </div>
        <nav className="flex gap-6">
          <button
            onClick={onNewCase}
            className="text-on-surface/50 hover:text-on-surface transition-colors text-sm font-body"
          >
            Nuevo caso
          </button>
          <button
            onClick={onAbout}
            className="text-on-surface/50 hover:text-on-surface transition-colors text-sm font-body"
          >
            Acerca de
          </button>
        </nav>
      </div>

      {/* Right: status indicator + FUCS logo */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-tertiary shadow-glow" />
          <span className="text-xs font-mono text-tertiary/70 uppercase tracking-widest">
            Adenocarcinoma Pulmonar
          </span>
        </div>

        <img
          src={logoFucs}
          alt="Universidad FUCS"
          className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>
    </header>
  )
}
