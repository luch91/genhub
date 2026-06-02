import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-slate-800 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-600 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-700 text-[10px] font-bold text-white">
            GL
          </span>
          <span>GenLayer Builders Hub</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/projects" className="hover:text-slate-400">
            Projects
          </Link>
          <Link href="/builders" className="hover:text-slate-400">
            Builders
          </Link>
          <Link href="/feed" className="hover:text-slate-400">
            Feed
          </Link>
          <a
            href="https://genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400"
          >
            GenLayer.com
          </a>
        </nav>
      </div>
    </footer>
  )
}
