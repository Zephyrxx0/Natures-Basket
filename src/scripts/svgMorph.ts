/**
 * Configuration options for SVG morphing animation
 */
export interface MorphOptions {
  /** Duration of the animation in milliseconds (default: 1000) */
  duration?: number;
  /** Easing function (default: 'easeInOutQuad') */
  easing?: string;
  /** Delay before animation starts in milliseconds (default: 0) */
  delay?: number;
  /** Whether to loop the animation (default: false) */
  loop?: boolean;
  /** Direction of animation: 'normal', 'reverse', 'alternate' (default: 'normal') */
  direction?: 'normal' | 'reverse' | 'alternate';
  /** Callback function when animation begins */
  onBegin?: () => void;
  /** Callback function when animation completes */
  onComplete?: () => void;
  /** Callback function during animation with progress */
  onUpdate?: (anim: any) => void;
}

// Helper to get anime instance
async function getAnime() {
  const animeModule = await import('animejs');
  // Try different possible exports
  return animeModule.default || (animeModule as any).anime || animeModule;
}

/**
 * Animates SVG path morphing from one shape to another
 * @param sourceSelector - CSS selector or element for the source SVG path
 * @param targetPath - The target 'd' attribute value to morph into
 * @param options - Animation configuration options
 * @returns anime.AnimeInstance - The animation instance for control
 * 
 * @example
 * ```typescript
 * // Morph a single path
 * morphSVG('.my-path', 'M150 0 L75 200 L225 200 Z', {
 *   duration: 2000,
 *   easing: 'easeInOutQuad'
 * });
 * ```
 */
export async function morphSVG(
  sourceSelector: string | Element,
  targetPath: string,
  options: MorphOptions = {}
): Promise<any> {
  const anime = await getAnime();
  
  const {
    duration = 1000,
    easing = 'easeInOutQuad',
    delay = 0,
    loop = false,
    direction = 'normal',
    onBegin,
    onComplete,
    onUpdate
  } = options;

  console.log('Animating with anime:', typeof anime, anime);
  console.log('Target:', sourceSelector, 'Path:', targetPath);

  const animation = anime({
    targets: sourceSelector,
    d: [{ value: targetPath }],
    duration,
    easing,
    delay,
    loop,
    direction,
    begin: onBegin,
    complete: onComplete,
    update: onUpdate
  });

  console.log('Animation created:', animation);
  return animation;
}

/**
 * Configuration for multi-path morphing
 */
export interface MultiMorphConfig {
  /** CSS selector or element for the SVG path */
  target: string | Element;
  /** The target 'd' attribute value to morph into */
  targetPath: string;
  /** Optional individual animation options (overrides global options) */
  options?: MorphOptions;
}

/**
 * Animates multiple SVG paths simultaneously with individual or shared configurations
 * @param morphConfigs - Array of morph configurations for each SVG path
 * @param globalOptions - Global animation options applied to all paths (can be overridden per path)
 * @returns anime.AnimeInstance[] - Array of animation instances for control
 * 
 * @example
 * ```typescript
 * // Morph multiple paths with global settings
 * morphMultipleSVGs([
 *   { target: '.shape-1', targetPath: 'M100 100 L200 200 L100 300 Z' },
 *   { target: '.shape-2', targetPath: 'M300 100 L400 200 L300 300 Z' },
 *   { target: '.shape-3', targetPath: 'M500 100 L600 200 L500 300 Z', 
 *     options: { duration: 2000 } } // Individual override
 * ], {
 *   duration: 1500,
 *   easing: 'easeInOutElastic(1, .6)',
 *   loop: true
 * });
 * ```
 */
export async function morphMultipleSVGs(
  morphConfigs: MultiMorphConfig[],
  globalOptions: MorphOptions = {}
): Promise<any[]> {
  return Promise.all(
    morphConfigs.map(({ target, targetPath, options }) => {
      // Merge global options with individual options (individual takes precedence)
      const mergedOptions = { ...globalOptions, ...options };
      return morphSVG(target, targetPath, mergedOptions);
    })
  );
}

/**
 * Animates a sequence of SVG morphs on the same element
 * @param target - CSS selector or element for the SVG path
 * @param pathSequence - Array of target 'd' attribute values to morph through
 * @param options - Animation configuration options
 * @returns anime.AnimeInstance - The timeline animation instance
 * 
 * @example
 * ```typescript
 * // Create a sequence of morphs
 * morphSequence('.my-path', [
 *   'M150 0 L75 200 L225 200 Z',  // Triangle
 *   'M150 50 L225 150 L150 250 L75 150 Z',  // Diamond
 *   'M100 100 L200 100 L200 200 L100 200 Z'  // Square
 * ], {
 *   duration: 1000,
 *   loop: true
 * });
 * ```
 */
export async function morphSequence(
  target: string | Element,
  pathSequence: string[],
  options: MorphOptions = {}
): Promise<any> {
  const anime = await getAnime();
  
  const {
    duration = 1000,
    easing = 'easeInOutQuad',
    delay = 0,
    loop = false,
    direction = 'normal',
    onBegin,
    onComplete,
    onUpdate
  } = options;

  const timeline = anime.timeline({
    loop,
    direction,
    begin: onBegin,
    complete: onComplete
  });

  pathSequence.forEach((targetPath, index) => {
    timeline.add({
      targets: target,
      d: [{ value: targetPath }],
      duration,
      easing,
      delay: index === 0 ? delay : 0,
      update: onUpdate
    }, index === 0 ? 0 : `+=${0}`); // Start next animation immediately after previous
  });

  return timeline;
}

/**
 * Creates a continuous morph loop between two or more shapes
 * @param target - CSS selector or element for the SVG path
 * @param paths - Array of path values to cycle through (minimum 2)
 * @param options - Animation configuration options
 * @returns anime.AnimeInstance - The animation instance
 * 
 * @example
 * ```typescript
 * // Create continuous loop between shapes
 * morphLoop('.my-path', [
 *   'M150 0 L75 200 L225 200 Z',
 *   'M150 50 L225 150 L150 250 L75 150 Z'
 * ], {
 *   duration: 1500,
 *   easing: 'easeInOutSine'
 * });
 * ```
 */
export async function morphLoop(
  target: string | Element,
  paths: string[],
  options: MorphOptions = {}
): Promise<any> {
  if (paths.length < 2) {
    throw new Error('morphLoop requires at least 2 paths');
  }

  const anime = await getAnime();

  const {
    duration = 1000,
    easing = 'easeInOutQuad',
    delay = 0,
    onBegin,
    onComplete,
    onUpdate
  } = options;

  return anime({
    targets: target,
    d: paths.map(path => ({ value: path })),
    duration,
    easing,
    delay,
    loop: true,
    direction: 'alternate',
    begin: onBegin,
    complete: onComplete,
    update: onUpdate
  });
}
