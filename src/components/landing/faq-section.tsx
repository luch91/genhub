"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FAQS = [
  {
    q: "What is GenLayer?",
    a: "GenLayer is a blockchain platform that brings AI directly into smart contracts. Developers write Intelligent Contracts — programs that can call large language models, access the web, and reason over unstructured data as part of their on-chain execution.",
  },
  {
    q: "What is an Intelligent Contract?",
    a: "An Intelligent Contract is a GenLayer smart contract that can invoke LLMs mid-execution. This lets contracts interpret natural language, evaluate subjective conditions, and make decisions that require world knowledge — capabilities that are impossible on traditional blockchains.",
  },
  {
    q: "What language do I write GenLayer contracts in?",
    a: "Intelligent Contracts are written in Python. GenLayer Studio provides a browser-based IDE so you can write, test, and deploy without any local setup.",
  },
  {
    q: "Is GenHub free to use?",
    a: "Yes, completely. GenHub is a community platform — no subscriptions, no paid tiers, no credit card required. Every builder gets full access to submit projects, post updates, join discussions, and connect with the community.",
  },
  {
    q: "How does the project review process work?",
    a: "When you submit a project it enters a peer review queue. Three community members with at least one published project each review it. Three approvals publishes it to the gallery; three rejections returns it with feedback so you can revise and resubmit.",
  },
  {
    q: "Can I submit a work-in-progress?",
    a: "Yes. Once your project is live you can post milestone, blocker, and breakthrough updates as you build. Your project page becomes a live development log — the community can follow your progress, not just the finished result.",
  },
]

function FaqItem({ item, index }: { item: (typeof FAQS)[number]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-brand-indigo/10 last:border-0"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-ui text-base font-semibold text-brand-navy">{item.q}</span>
        <span
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-brand-indigo/20 font-mono text-xs text-brand-indigo transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-body text-sm leading-relaxed text-brand-navy/60">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-brand-cream px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-indigo/50">
            FAQ
          </span>
          <h2 className="mt-3 font-display text-4xl font-black text-brand-navy md:text-5xl">
            Common questions
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-body text-base text-brand-navy/55">
            Everything you need to know about GenLayer and GenHub.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-brand-indigo/10 bg-white px-8 py-2">
          {FAQS.map((item, i) => (
            <FaqItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
