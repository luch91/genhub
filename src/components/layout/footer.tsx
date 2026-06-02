import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-brand-indigo/10 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="grid grid-cols-3 gap-0.5" aria-hidden="true">
            {["#fbbf24","#fbbf24","#fbbf24","#fbbf24","#1a1a2e","#fbbf24","#4f46e5","#4f46e5","#4f46e5"].map((c, i) => (
              <span key={i} className="rounded-[2px]" style={{ width: 7, height: 7, backgroundColor: c }} />
            ))}
          </div>
          <span className="font-ui text-sm font-semibold text-brand-navy/60">GenHub</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-brand-navy/45">
          <Link href="/projects" className="hover:text-brand-navy transition-colors">Projects</Link>
          <Link href="/builders" className="hover:text-brand-navy transition-colors">Builders</Link>
          <Link href="/feed"     className="hover:text-brand-navy transition-colors">Feed</Link>
          <Link href="/discuss"  className="hover:text-brand-navy transition-colors">Discuss</Link>
          <a
            href="https://genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-navy transition-colors"
          >
            GenLayer.com
          </a>
        </nav>
      </div>
    </footer>
  )
}
