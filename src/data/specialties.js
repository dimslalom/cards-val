// Player specialties - up to five per card, though only three exist today.
// A specialty is a signature trait that grants a situational bonus in the sim.
// Assignments are curated from VLR player reputations; One Trick additionally
// picks up any player whose synced agent pool is a single agent.

export const SPECIALTIES = {
  flex: {
    key: 'flex',
    name: 'Flex',
    code: 'FLX',
    short: 'Fills an extra role',
    board: 'Moves free during the rotate',
    color: '#7ce8ff',
    desc: 'Counts as one additional role class for coverage. No role-stacking chemistry penalty.',
  },
  flick: {
    key: 'flick',
    name: 'Flick',
    code: 'FLK',
    short: 'Aim over positioning',
    board: 'Alone on a lane: scores their best stat',
    color: '#ffd36b',
    desc: 'Bonus aim when dueling opponents who out-position them. Raw reactions beat setup.',
  },
  one_trick: {
    key: 'one_trick',
    name: 'One Trick',
    code: '1TK',
    short: 'Single-agent master',
    board: '+20 on maps that suit their agent',
    color: '#ff8a3d',
    desc: 'Mastered a single agent. Bonus ability and synergy when no teammate shares that agent pool.',
  },
  mastermind: {
    key: 'mastermind',
    name: 'Mastermind',
    code: 'MMD',
    short: 'Elevates as IGL',
    board: 'As IGL: two rotates',
    color: '#7fd8ff',
    desc: 'When named IGL, a mid-round read spikes their positioning and mentality by +2 to +10.',
  },
  aura: {
    key: 'aura',
    name: 'Aura',
    code: 'AUR',
    short: 'Rattles opponents',
    board: '-15 to the enemy on their lane',
    color: '#b98cff',
    desc: 'Sheer presence drags down the opposing squad’s mentality every map.',
  },
  anchor: {
    key: 'anchor',
    name: 'Anchor',
    code: 'ANC',
    short: 'Site lockdown duo',
    board: 'With 1 teammate: both +12',
    color: '#a9dcff',
    desc: 'Holds down the site in a 2-man setup. Grants +12 defensive boost to both.',
  },
  first_blood: {
    key: 'first_blood',
    name: 'First Blood',
    code: 'FBD',
    short: 'Aggressive opening duelist',
    board: 'On primary lane: +20',
    color: '#f87171',
    desc: 'Opening duel specialist. Gains +20 duel bonus on the first lane.',
  },
  clutch: {
    key: 'clutch',
    name: 'Clutch',
    code: 'CLT',
    short: 'Underdog round winner',
    board: 'Alone vs 2+: +25',
    color: '#c084fc',
    desc: 'Thrives under pressure. When alone against 2 or more enemies on a lane, gains +25 power.',
  },
  synergy_link: {
    key: 'synergy_link',
    name: 'Synergy Link',
    code: 'LNK',
    short: 'Universal team chemistry',
    board: 'Teammate combo with anyone',
    color: '#22d3ee',
    desc: 'Adapts seamlessly to any squad. Triggers +15 teammate combo with any lane partner.',
  },
  overdrive: {
    key: 'overdrive',
    name: 'Overdrive',
    code: 'OVD',
    short: 'Momentum',
    board: 'Win lane: other lanes x1.2; lose it: x0.9',
    color: '#fbbf24',
    desc: 'Winning its lane lifts your other lanes x1.2. Losing it tilts them x0.9.',
  },
  ironclad: {
    key: 'ironclad',
    name: 'Ironclad',
    code: 'ICD',
    short: 'Fortress lane',
    board: 'No chips work on its lane, either side; +4',
    color: '#f59e0b',
    desc: 'Holds the lane behind a steel plate. No tactic chip works on this lane, yours or the enemy\'s, and the lane gains +4.',
  },
  lurk: {
    key: 'lurk',
    name: 'Lurk',
    code: 'LRK',
    short: 'Cloaked flank',
    board: 'Hidden until resolve; +6 vs 1; cannot rotate',
    color: '#2dd4bf',
    desc: 'Stays hidden from the opponent until resolve and gains +6 facing a single enemy. Committed in the smoke, it cannot be moved at the rotate.',
  },
  velocity: {
    key: 'velocity',
    name: 'Velocity',
    code: 'VEL',
    short: 'Swift flank',
    board: 'Dashes to a lane lost by 4 or less; arrives at 40%',
    color: '#84cc16',
    desc: 'At resolve, dashes to your closest lane lost by 4 or less, even if leaving costs its own lane. It arrives spent and scores 40% of its stat there.',
  },
  combustion: {
    key: 'combustion',
    name: 'Combustion',
    code: 'CMB',
    short: 'Solar flare',
    board: 'Win lane: next lane enemy star -20%; -5 fuel',
    color: '#fb923c',
    desc: 'Burns 5 points of its own lane as fuel. If that lane is won, a flare cuts the enemy star on the next lane by 20% (up to 10).',
  },
  phase: {
    key: 'phase',
    name: 'Phase',
    code: 'PHS',
    short: 'Rift',
    board: 'Best enemy facing it scores 0; it scores half',
    color: '#a855f7',
    desc: 'Opens a rift on its lane: the highest-rated enemy facing it scores 0, and Phase itself scores half.',
  },
  timewarp: {
    key: 'timewarp',
    name: 'Timewarp',
    code: 'TRP',
    short: 'Rewind',
    board: 'Lose a series by one map: replay it, once',
    color: '#eab308',
    desc: 'If your side loses a series by a single map, the last map rewinds and is played again. Once per series.',
  },
  surge: {
    key: 'surge',
    name: 'Surge',
    code: 'SRG',
    short: 'Chain lightning',
    board: 'With ally: next lane -8 per enemy, -2 per ally',
    color: '#38bdf8',
    desc: 'With an ally on its lane, chain lightning strikes the next lane: -8 for each enemy card there, and -2 for each of your own.',
  },
  ascendance: {
    key: 'ascendance',
    name: 'Ascendance',
    code: 'ASC',
    short: 'Falls and rises',
    board: 'Lane lost: flies to a losing lane at 75%',
    color: '#fb7185',
    desc: 'If her lane is lost, she leaves it, taking her score with her, and lands on your closest losing lane with 75% of her stat.',
  },
  dominion: {
    key: 'dominion',
    name: 'Dominion',
    code: 'DMN',
    short: 'Lone crown',
    board: 'Plays alone, best stat; lane counts double; voids enemy chip',
    color: '#d946ef',
    desc: 'Rules her lane alone and scores her best stat there. Her lane counts as two lanes won, for whoever takes it, and the enemy chip on it is void.',
  },
  black_hole: {
    key: 'black_hole',
    name: 'Black Hole',
    code: 'BKH',
    short: 'Event horizon',
    board: 'Pulls the enemy star in at half stats',
    color: '#06b6d4',
    desc: 'Pulls the enemy\'s highest-rated card from another lane into its own. The star arrives at half its stats.',
  },
};

/** Skills a card can only learn by finishing an evo. */
export const EVO_SKILLS = new Set([
  'anchor', 'first_blood', 'clutch', 'synergy_link', 'overdrive',
  'ironclad', 'lurk', 'velocity', 'combustion', 'phase', 'timewarp', 'surge',
  'ascendance', 'dominion', 'black_hole',
]);

export const SPECIALTY_ORDER = [
  'flex', 'flick', 'one_trick', 'mastermind', 'aura',
  'anchor', 'first_blood', 'clutch', 'synergy_link', 'overdrive',
  'ironclad', 'lurk', 'velocity', 'combustion', 'phase', 'timewarp', 'surge',
  'ascendance', 'dominion', 'black_hole',
];

// Curated from VLR player reputations. Keys are lowercased player names; the
// card's synced agent pool decides One Trick on top of this.
const ASSIGN = {
  // Flex - genuine multi-role players
  f0rsaken: ['flex', 'flick'],
  chronicle: ['flex'],
  nats: ['flex'],
  sacy: ['flex'],
  d4v41: ['flex'],
  ethan: ['flex'],
  victor: ['flex', 'flick'],
  leo: ['flex'],
  trent: ['flex'],
  // Flick - flick-heavy aimers who thrive against set opponents
  something: ['flick'],
  aspas: ['flick'],
  derke: ['flick'],
  zekken: ['flick', 'flex'],
  tenz: ['flick'],
  yay: ['flick'],
  scream: ['flick'],
  cned: ['flick'],
  wardell: ['flick'],
  cryocells: ['flick'],
  sayaplayer: ['flick'],
  purp0: ['flick'],
  zmjjkk: ['flick', 'aura'],
  mazino: ['flick'],
  // One Trick - single-agent masters
  jinggg: ['one_trick', 'flick'],
  kingg: ['one_trick'],
  // Mastermind - elite in-game leaders
  boaster: ['mastermind'],
  fns: ['mastermind'],
  saadhak: ['mastermind'],
  runner: ['mastermind'],
  sscary: ['mastermind'],
  // Aura - presence that rattles the other side
  koalanoob: ['aura'],
};

// Up to five specialty objects for a card, in canonical order.
export function getCardSpecialties(card) {
  if (!card) return [];
  const keys = new Set(
    Array.isArray(card.specialties) && card.specialties.length
      ? card.specialties
      : ASSIGN[card.player?.toLowerCase()] ?? [],
  );
  // Data-driven: a single-agent pool (from the VLR sync) is a One Trick.
  if ((card.agents?.length ?? 0) === 1) keys.add('one_trick');
  if (Array.isArray(card.learned)) {
    for (const k of card.learned) keys.add(k);
  }

  return SPECIALTY_ORDER
    .filter(k => keys.has(k))
    .slice(0, 5)
    .map(k => SPECIALTIES[k]);
}
