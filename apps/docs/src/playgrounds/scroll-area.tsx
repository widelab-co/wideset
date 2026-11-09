import { playground } from '../lib/playground-kit';

/**
 * Visibility, gutter and motion come from `ScrollAreaProps`. The stage is a vertical feed with
 * nothing to scroll sideways, so the orientation is left to the Orientations example.
 */
export default playground({ from: 'ScrollAreaProps', hide: ['orientation'] });
