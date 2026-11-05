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
    short: 'Momentum catalyst',
    board: 'Win lane: +0.2x other lanes',
    color: '#fbbf24',
    desc: 'Dominates their lane to create space. Winning this lane boosts all other lanes by +0.2x.',
  },
};

/** Skills a card can only learn by finishing an evo. */
export const EVO_SKILLS = new Set(['anchor', 'first_blood', 'clutch', 'synergy_link', 'overdrive']);

export const SPECIALTY_ORDER = [
  'flex', 'flick', 'one_trick', 'mastermind', 'aura',
  'anchor', 'first_blood', 'clutch', 'synergy_link', 'overdrive',
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
