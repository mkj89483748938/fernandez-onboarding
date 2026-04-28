'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react'

type Pair = { term: string; definition: string }

type Props = {
  pairs: Pair[]
  onPass: () => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function MatchingQuiz({ pairs, onPass }: Props) {
  const terms = useMemo(() => shuffle(pairs.map(p => p.term)), [pairs])
  const definitions = useMemo(() => shuffle(pairs.map(p => p.definition)), [pairs])

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [matched, setMatched] = useState<Record<string, string>>({}) // term -> definition
  const [wrong, setWrong] = useState<string | null>(null)
  const [passed, setPassed] = useState(false)

  const correctMap = useMemo(() => {
    const m: Record<string, string> = {}
    pairs.forEach(p => { m[p.term] = p.definition })
    return m
  }, [pairs])

  const matchedTerms = new Set(Object.keys(matched))
  const matchedDefs = new Set(Object.values(matched))

  function handleTermClick(term: string) {
    if (matchedTerms.has(term)) return
    setSelectedTerm(prev => prev === term ? null : term)
    setWrong(null)
  }

  function handleDefClick(def: string) {
    if (matchedDefs.has(def)) return
    if (!selectedTerm) return

    if (correctMap[selectedTerm] === def) {
      const next = { ...matched, [selectedTerm]: def }
      setMatched(next)
      setSelectedTerm(null)
      setWrong(null)
      if (Object.keys(next).length === pairs.length) {
        setPassed(true)
        onPass()
      }
    } else {
      setWrong(selectedTerm)
      setTimeout(() => {
        setWrong(null)
        setSelectedTerm(null)
      }, 800)
    }
  }

  function reset() {
    setMatched({})
    setSelectedTerm(null)
    setWrong(null)
    setPassed(false)
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <div>
          <p className="text-sm font-semibold">Quiz  -  Match the Stage</p>
          <p className="text-xs text-zinc-400 mt-0.5">Click a stage name, then click its matching description.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">{Object.keys(matched).length}/{pairs.length} matched</span>
          {Object.keys(matched).length > 0 && !passed && (
            <button onClick={reset} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {passed ? (
        <div className="p-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <p className="font-semibold text-lg">Nice work!</p>
          <p className="text-sm text-zinc-500 mt-1">You matched all stages correctly.</p>
          <button onClick={reset} className="mt-4 text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1 mx-auto">
            <RotateCcw className="w-3 h-3" /> Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-5">
          {/* Terms */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Stages</p>
            {terms.map(term => {
              const isMatched = matchedTerms.has(term)
              const isSelected = selectedTerm === term
              const isWrong = wrong === term
              return (
                <button
                  key={term}
                  onClick={() => handleTermClick(term)}
                  disabled={isMatched}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                      : isWrong
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : isSelected
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isMatched && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                    {isWrong && <XCircle className="w-3.5 h-3.5 shrink-0" />}
                    {term}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Definitions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Descriptions</p>
            {definitions.map(def => {
              const isMatched = matchedDefs.has(def)
              return (
                <button
                  key={def}
                  onClick={() => handleDefClick(def)}
                  disabled={isMatched || !selectedTerm}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs leading-relaxed transition-all ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 cursor-default'
                      : !selectedTerm
                      ? 'bg-zinc-50 border-zinc-100 text-zinc-400 cursor-default'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:bg-zinc-50 cursor-pointer'
                  }`}
                >
                  {def}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
