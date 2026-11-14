import type { Product } from '../data/types';
import { scoresFor } from './scoring';
import { verdict, type Priority } from './verdict';

export interface Ranked {
  p: Product;
  rank: number;
  score: number;
  /** one-line headline: why it sits where it does */
  headline: string;
  /** #1: what it beats the runner-up on. Others: what #1 does better. */
  why: string[];
  /** not #1: where it beats #1 anyway */
  edge: string[];
}

/** The upgrade advisor phrases points as "moving from A to B"; reword them as plain comparisons. */
const tidy = (t: string) =>
  t
    .replace(/\s+vs\s+—\s*fps/g, ' (the other can’t)')
    .replace(/\s+vs\s+—/g, '')
    .replace(/^Gains /, '')
    .replace(/\(from ([^)]+)\)/g, '(vs $1)');

const FOCUS: Record<Priority, string> = { hybrid: 'overall', photo: 'photo', video: 'video', flight: 'flying' };

export const priorityScore = (p: Product, priority: Priority) => {
  const s = scoresFor(p);
  return priority === 'photo' ? s.photo : priority === 'video' ? s.video : priority === 'flight' ? s.flight ?? s.overall : s.overall;
};

/** Rank 3–4 products and explain each position, with no assumption about which one you own. */
export function rankWithReasons(items: Product[], priority: Priority): Ranked[] {
  const sorted = [...items].sort((a, b) => priorityScore(b, priority) - priorityScore(a, priority));
  const top = sorted[0];
  const second = sorted[1];
  const topScore = priorityScore(top, priority);
  const focus = FOCUS[priority];

  return sorted.map((p, i) => {
    const score = priorityScore(p, priority);
    if (i === 0) {
      const lead = topScore - priorityScore(second, priority);
      return {
        p,
        rank: 1,
        score,
        headline: lead > 0 ? `Best ${focus} score here, ${lead} point${lead > 1 ? 's' : ''} ahead of the ${second.model}.` : `Joint best ${focus} score with the ${second.model}.`,
        why: verdict(second, top, priority)
          .gains.slice(0, 3)
          .map((g) => tidy(g.text)),
        edge: [],
      };
    }
    const gap = topScore - score;
    return {
      p,
      rank: i + 1,
      score,
      headline: gap > 0 ? `${gap} point${gap > 1 ? 's' : ''} behind the ${top.model}.` : `Level with the ${top.model} on score.`,
      why: verdict(p, top, priority)
        .gains.slice(0, 2)
        .map((g) => tidy(g.text)),
      edge: verdict(top, p, priority)
        .gains.slice(0, 2)
        .map((g) => tidy(g.text)),
    };
  });
}
