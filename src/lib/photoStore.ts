import base from '../data/photos.json';

/** Linked product photos for one product (first = front/hero) and where they came from. */
export interface PhotoSet {
  files: string[];
  source: string;
  page: string;
  title?: string;
}

const SETS = base as Record<string, PhotoSet>;

/** Every product's photo set, keyed by product id. */
export const allSets = (): Record<string, PhotoSet> => SETS;

/** Kept as a hook so components read photos the same way everywhere. */
export const usePhotoSets = () => SETS;
