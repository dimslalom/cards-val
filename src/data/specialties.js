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
  ironclad: {
    key: 'ironclad',
    name: 'Ironclad',
    code: 'ICD',
    short: 'Fortress anchor',
    board: 'Lane immune to tactic debuffs; +3',
    color: '#f59e0b',
    desc: 'Fortifies the lane. Immune to enemy tactic debuffs on this lane, and grants +3 armor.',
  },
  lurk: {
    key: 'lurk',
    name: 'Lurk',
    code: 'LRK',
    short: 'Cloaked flank',
    board: 'Stealthed until resolve; +4 vs 1',
    color: '#2dd4bf',
    desc: 'Shrouded from opponent until resolve. Grants +4 duel power when opposing lane has only 1 card.',
  },
  velocity: {
    key: 'velocity',
    name: 'Velocity',
    code: 'VEL',
    short: 'Swift flank',
    board: 'Flashes to clutched losing lane',
    color: '#84cc16',
    desc: 'Rapid tactical reaction. Automatically rotates to flip a losing lane during resolve (-4 sprint fatigue).',
  },
  combustion: {
    key: 'combustion',
    name: 'Combustion',
    code: 'CMB',
    short: 'Solar eclipse',
    board: 'Win lane: -20% adjacent enemy star',
    color: '#fb923c',
    desc: 'Blazes through resistance. Winning this lane blinds the adjacent enemy star, dampening their rating by 20% (up to -10).',
  },
  phase: {
    key: 'phase',
    name: 'Phase',
    code: 'PHS',
    short: 'Dimensional shift',
    board: 'Siphons +4 from facing synergy',
    color: '#a855f7',
    desc: 'Phases through enemy bonds. Siphons +4 from the opposing player if they have an active Team or Nation synergy.',
  },
  timewarp: {
    key: 'timewarp',
    name: 'Timewarp',
    code: 'TRP',
    short: 'Temporal surge',
    board: 'Losing by <=6: +6 rewind surge',
    color: '#eab308',
    desc: 'Bends the final moments. If an allied lane is losing by 6 or fewer, grants +6 rewind surge to that lane.',
  },
  surge: {
    key: 'surge',
    name: 'Surge',
    code: 'SRG',
    short: 'Chain lightning',
    board: 'With ally: -4 adjacent enemy lane',
    color: '#38bdf8',
    desc: 'Storms the objective. When paired with an ally, shocks an adjacent enemy lane for -4.',
  },
  ascendance: {
    key: 'ascendance',
    name: 'Ascendance',
    code: 'ASC',
    short: 'Divine blessing',
    board: 'Trailing <=10: +8 to ally, or +4',
    color: '#fb7185',
    desc: 'Transcends the battlefield. Grants +8 to an allied lane trailing by 10 or fewer, or +4 to self.',
  },
  dominion: {
    key: 'dominion',
    name: 'Dominion',
    code: 'DMN',
    short: 'Royal tribute',
    board: 'Collects +2 per enemy synergy (max +8)',
    color: '#d946ef',
    desc: 'Total domain supremacy. Collects 2 points per active enemy synergy across all lanes (max +8).',
  },
  black_hole: {
    key: 'black_hole',
    name: 'Black Hole',
    code: 'BKH',
    short: 'Event horizon',
    board: 'Pulls enemy star from other lane',
    color: '#06b6d4',
    desc: 'Inescapable gravitational pull. Drags the opponent highest-rated player from another lane into this lane.',
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
