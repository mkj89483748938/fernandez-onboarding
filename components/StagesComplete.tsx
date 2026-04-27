'use client'

import { useState } from 'react'
import MatchingQuiz from './MatchingQuiz'
import SectionComplete from './SectionComplete'

type Pair = { term: string; definition: string }

type Props = {
  pairs: Pair[]
  moduleId: string
  sectionId: string
  completed: boolean
  nextHref?: string
}

export default function StagesComplete({ pairs, moduleId, sectionId, completed, nextHref }: Props) {
  const [quizPassed, setQuizPassed] = useState(completed)

  return (
    <div className="space-y-4">
      {!completed && (
        <MatchingQuiz pairs={pairs} onPass={() => setQuizPassed(true)} />
      )}
      <div className="flex justify-end">
        <SectionComplete
          moduleId={moduleId}
          sectionId={sectionId}
          completed={completed}
          nextHref={nextHref}
          disabled={!quizPassed}
          label={quizPassed ? 'Mark as Complete' : 'Complete the quiz above to continue'}
        />
      </div>
    </div>
  )
}
