export interface GuessWordItem {
  id: string;
  word: string;
  clue: string;
  category: string;
  level: number;
}

export const GUESS_WORD_LEVELS: Record<number, GuessWordItem[]> = {
  // Level 1: 3-4 letters
  1: [
    { id: 'gw-1-1', word: 'SUN', clue: 'The central star of our solar system providing light and warmth to Earth', category: 'Astronomy', level: 1 },
    { id: 'gw-1-2', word: 'MOON', clue: 'Earth sole natural satellite that orbits our planet every 27 days', category: 'Astronomy', level: 1 },
    { id: 'gw-1-3', word: 'BOOK', clue: 'A written or printed work consisting of pages glued together along one side', category: 'Literature', level: 1 },
    { id: 'gw-1-4', word: 'STAR', clue: 'A luminous astronomical point of plasma held together by its own gravity', category: 'Astronomy', level: 1 },
    { id: 'gw-1-5', word: 'SHIP', clue: 'A large buoyant watercraft designed for navigating oceans and rivers', category: 'Transport', level: 1 },
    { id: 'gw-1-6', word: 'FISH', clue: 'A limbless cold-blooded vertebrate animal with gills and fins living in water', category: 'Biology', level: 1 },
    { id: 'gw-1-7', word: 'BIRD', clue: 'A warm-blooded egg-laying vertebrate distinguished by feathers, wings, and beak', category: 'Biology', level: 1 },
    { id: 'gw-1-8', word: 'TREE', clue: 'A woody perennial plant having a single stem or trunk growing to considerable height', category: 'Nature', level: 1 },
    { id: 'gw-1-9', word: 'RAIN', clue: 'Moisture condensed from atmospheric vapor that falls to Earth in drops', category: 'Weather', level: 1 },
    { id: 'gw-1-10', word: 'GOLD', clue: 'A precious yellow metallic element with atomic number 79 prized in jewelry', category: 'Chemistry', level: 1 },
  ],

  // Level 2: 5 letters
  2: [
    { id: 'gw-2-1', word: 'OCEAN', clue: 'A vast continuous body of saline water covering more than 70% of Earth', category: 'Geography', level: 2 },
    { id: 'gw-2-2', word: 'BRAIN', clue: 'The complex neurological organ that serves as the center of sensation and thought', category: 'Anatomy', level: 2 },
    { id: 'gw-2-3', word: 'HEART', clue: 'The muscular organ in humans that pumps oxygenated blood through the circulatory system', category: 'Anatomy', level: 2 },
    { id: 'gw-2-4', word: 'LIGHT', clue: 'Electromagnetic radiation within the portion of the spectrum that can be perceived by the human eye', category: 'Physics', level: 2 },
    { id: 'gw-2-5', word: 'FLAME', clue: 'The visible, gaseous part of a fire resulting from an exothermic chemical reaction', category: 'Chemistry', level: 2 },
    { id: 'gw-2-6', word: 'CLOUD', clue: 'A visible mass of condensed water vapor floating high in the atmosphere', category: 'Weather', level: 2 },
    { id: 'gw-2-7', word: 'RIVER', clue: 'A large natural flowing stream of fresh water heading towards an ocean or lake', category: 'Geography', level: 2 },
    { id: 'gw-2-8', word: 'SWORD', clue: 'A traditional bladed weapon consisting of a long steel blade and protective hilt', category: 'History', level: 2 },
    { id: 'gw-2-9', word: 'EARTH', clue: 'The third planet from the Sun and the only astronomical body known to harbor life', category: 'Astronomy', level: 2 },
    { id: 'gw-2-10', word: 'WHALE', clue: 'The largest marine mammal inhabiting the oceans of the world', category: 'Marine Biology', level: 2 },
  ],

  // Level 3: 5-6 letters
  3: [
    { id: 'gw-3-1', word: 'BRIDGE', clue: 'A structure built to span physical obstacles like water or canyons for travel', category: 'Engineering', level: 3 },
    { id: 'gw-3-2', word: 'TIGER', clue: 'The largest living cat species known for dark vertical stripes on orange fur', category: 'Zoology', level: 3 },
    { id: 'gw-3-3', word: 'CASTLE', clue: 'A fortified medieval building typically built by European royalty or nobility', category: 'Architecture', level: 3 },
    { id: 'gw-3-4', word: 'DESERT', clue: 'A barren geographic region with little precipitation where living conditions are hostile', category: 'Geography', level: 3 },
    { id: 'gw-3-5', word: 'FOREST', clue: 'A large biological area dominated by dense canopies of trees and undergrowth', category: 'Nature', level: 3 },
    { id: 'gw-3-6', word: 'ISLAND', clue: 'A tract of land completely surrounded by water, smaller than a continent', category: 'Geography', level: 3 },
    { id: 'gw-3-7', word: 'VALLEY', clue: 'A low elongated area of land between hills or mountains, typically with a stream', category: 'Geography', level: 3 },
    { id: 'gw-3-8', word: 'CANYON', clue: 'A deep gorge, typically one with a river flowing through it, as in Arizona', category: 'Geography', level: 3 },
    { id: 'gw-3-9', word: 'TEMPLE', clue: 'A sacred building devoted to the worship or residence of deities in ancient faiths', category: 'Culture', level: 3 },
    { id: 'gw-3-10', word: 'KNIGHT', clue: 'A mounted armored warrior granted honorary title of knighthood in medieval times', category: 'History', level: 3 },
  ],

  // Level 4: 6-7 letters
  4: [
    { id: 'gw-4-1', word: 'OXYGEN', clue: 'Essential chemical element with atomic number 8 required for human aerobic respiration', category: 'Chemistry', level: 4 },
    { id: 'gw-4-2', word: 'AMAZON', clue: 'The largest tropical rainforest on Earth situated across South America', category: 'Geography', level: 4 },
    { id: 'gw-4-3', word: 'GALAXY', clue: 'A gravitationally bound system of stars, stellar remnants, interstellar gas, and dark matter', category: 'Astronomy', level: 4 },
    { id: 'gw-4-4', word: 'VOLCANO', clue: 'A rupture in the crust of a planetary-mass object that allows hot lava and volcanic ash to escape', category: 'Geology', level: 4 },
    { id: 'gw-4-5', word: 'MAGNET', clue: 'A material or object that produces an unseen magnetic field pulling ferromagnetic items', category: 'Physics', level: 4 },
    { id: 'gw-4-6', word: 'SILVER', clue: 'A lustrous white transition metal with highest electrical and thermal conductivity of any element', category: 'Chemistry', level: 4 },
    { id: 'gw-4-7', word: 'SHADOW', clue: 'A dark area or shape produced by a body coming between rays of light and a surface', category: 'Physics', level: 4 },
    { id: 'gw-4-8', word: 'MIRROR', clue: 'A reflective surface that bounces light rays to produce an image of objects in front of it', category: 'Optics', level: 4 },
    { id: 'gw-4-9', word: 'JUPITER', clue: 'The largest gas giant planet in our solar system featuring a Great Red Spot storm', category: 'Astronomy', level: 4 },
    { id: 'gw-4-10', word: 'DIAMOND', clue: 'The hardest known natural mineral composed of pure crystallized carbon allotrope', category: 'Geology', level: 4 },
  ],

  // Level 5: 7-8 letters
  5: [
    { id: 'gw-5-1', word: 'PYRAMID', clue: 'Iconic monumental ancient stone tomb structure found in Giza, Egypt', category: 'World Wonders', level: 5 },
    { id: 'gw-5-2', word: 'EVEREST', clue: 'The highest mountain peak above sea level on Earth situated in the Himalayas', category: 'Geography', level: 5 },
    { id: 'gw-5-3', word: 'GLACIER', clue: 'A persistent body of dense ice that is constantly moving under its own gravity', category: 'Glaciology', level: 5 },
    { id: 'gw-5-4', word: 'TSUNAMI', clue: 'A series of immense ocean waves caused by undersea earthquakes or volcanic eruptions', category: 'Geophysics', level: 5 },
    { id: 'gw-5-5', word: 'COMPASS', clue: 'A navigational instrument showing cardinal directions with a magnetized needle', category: 'Navigation', level: 5 },
    { id: 'gw-5-6', word: 'CRYSTAL', clue: 'A solid material whose constituents are arranged in a highly ordered microscopic structure', category: 'Mineralogy', level: 5 },
    { id: 'gw-5-7', word: 'OCTOPUS', clue: 'An eight-limbed soft-bodied cephalopod mollusk renowned for camouflage and high intelligence', category: 'Marine Zoology', level: 5 },
    { id: 'gw-5-8', word: 'DOLPHIN', clue: 'A widely distributed aquatic mammal recognized for curved beak and echolocation', category: 'Zoology', level: 5 },
    { id: 'gw-5-9', word: 'METEOR', clue: 'A small body of matter from outer space that burns upon entering Earth atmosphere', category: 'Astronomy', level: 5 },
    { id: 'gw-5-10', word: 'THUNDER', clue: 'The loud acoustic shockwave produced by lightning rapidly heating surrounding air', category: 'Meteorology', level: 5 },
  ],

  // Level 6: 8-9 letters
  6: [
    { id: 'gw-6-1', word: 'AVALANCHE', clue: 'A rapid, dangerous flow of snow down a mountain slope triggered by natural or human factors', category: 'Geology', level: 6 },
    { id: 'gw-6-2', word: 'SATELLITE', clue: 'An artificial celestial body placed in orbit around the earth or moon to collect data or relay signals', category: 'Space Tech', level: 6 },
    { id: 'gw-6-3', word: 'LABYRINTH', clue: 'A complicated irregular network of passages or paths in which it is difficult to find one way', category: 'Mythology', level: 6 },
    { id: 'gw-6-4', word: 'DINOSAUR', clue: 'A diverse group of prehistoric reptiles that dominated terrestrial ecosystems for over 140 million years', category: 'Paleontology', level: 6 },
    { id: 'gw-6-5', word: 'ARCHITECT', clue: 'A professional person who designs buildings and oversees their construction', category: 'Design', level: 6 },
    { id: 'gw-6-6', word: 'HORIZON', clue: 'The apparent line that separates the surface of the Earth from the sky', category: 'Optics', level: 6 },
    { id: 'gw-6-7', word: 'TELESCOPE', clue: 'An optical instrument using lenses and curved mirrors to observe distant cosmic objects', category: 'Astronomy', level: 6 },
    { id: 'gw-6-8', word: 'PLATYPUS', clue: 'A semiaquatic egg-laying monotreme mammal native to eastern Australia with a duck-like bill', category: 'Zoology', level: 6 },
    { id: 'gw-6-9', word: 'CORRIDOR', clue: 'A long passage in a building from which doors lead into individual rooms', category: 'Architecture', level: 6 },
    { id: 'gw-6-10', word: 'BLIZZARD', clue: 'A severe snowstorm with high winds and low visibility lasting for prolonged hours', category: 'Meteorology', level: 6 },
  ],

  // Level 7: 9-10 letters
  7: [
    { id: 'gw-7-1', word: 'SUPERNOVA', clue: 'A colossal cosmic explosion that occurs at the end of a massive star life cycle', category: 'Astrophysics', level: 7 },
    { id: 'gw-7-2', word: 'CHLOROPHYLL', clue: 'The primary green pigment present in all green plants responsible for the absorption of light in photosynthesis', category: 'Biochemistry', level: 7 },
    { id: 'gw-7-3', word: 'METEORITE', clue: 'A piece of rock or metal from space that survives its fiery passage through the atmosphere and strikes the ground', category: 'Astronomy', level: 7 },
    { id: 'gw-7-4', word: 'CAROUSEL', clue: 'A rotating amusement ride consisting of a revolving circular platform with seats for riders', category: 'Leisure', level: 7 },
    { id: 'gw-7-5', word: 'BARRICADE', clue: 'An improvised barrier erected across a street or access route to prevent movement or defend against attackers', category: 'Defense', level: 7 },
    { id: 'gw-7-6', word: 'ECOSYSTEM', clue: 'A biological community of interacting organisms and their physical environment', category: 'Ecology', level: 7 },
    { id: 'gw-7-7', word: 'NAVIGATION', clue: 'The process or activity of accurately ascertaining position and planning a route', category: 'Maritime', level: 7 },
    { id: 'gw-7-8', word: 'ASTRONOMY', clue: 'The branch of science that studies celestial objects, space, and the physical universe as a whole', category: 'Science', level: 7 },
    { id: 'gw-7-9', word: 'MONUMENT', clue: 'A statue, building, or other structure erected to commemorate a notable person or event', category: 'History', level: 7 },
    { id: 'gw-7-10', word: 'SANCTUARY', clue: 'A nature reserve where animals and plants are protected from hunting and industrial predation', category: 'Conservation', level: 7 },
  ],

  // Level 8: 10 letters
  8: [
    { id: 'gw-8-1', word: 'PHILOSOPHY', clue: 'The study of the fundamental nature of knowledge, reality, logic, and human existence', category: 'Philosophy', level: 8 },
    { id: 'gw-8-2', word: 'ARCHAEOLOGY', clue: 'The scientific study of human activity through the recovery and analysis of material culture artifacts', category: 'Anthropology', level: 8 },
    { id: 'gw-8-3', word: 'ARISTOCRAT', clue: 'A member of the nobility or highest hereditary ruling class in certain societies', category: 'History', level: 8 },
    { id: 'gw-8-4', word: 'PERSEVERANCE', clue: 'Persistence in doing something despite difficulty or delay in achieving success; also a NASA Mars rover', category: 'General', level: 8 },
    { id: 'gw-8-5', word: 'METAMORPHIC', clue: 'Rock that has undergone transformation by natural heat, pressure, or other chemical agencies', category: 'Geology', level: 8 },
    { id: 'gw-8-6', word: 'LOCOMOTIVE', clue: 'A powered rail vehicle used for pulling or pushing trains across railway networks', category: 'Transportation', level: 8 },
    { id: 'gw-8-7', word: 'CHRONOLOGY', clue: 'The arrangement of events or dates in the exact order of their occurrence in time', category: 'History', level: 8 },
    { id: 'gw-8-8', word: 'HYPOTHESIS', clue: 'A proposed scientific explanation made on the basis of limited evidence as a starting point for investigation', category: 'Science', level: 8 },
    { id: 'gw-8-9', word: 'REVOLUTION', clue: 'A forcible overthrow of a government or social order in favor of a new system', category: 'Politics', level: 8 },
    { id: 'gw-8-10', word: 'SPECTATOR', clue: 'A person who watches a game, show, tournament, or other live public event', category: 'Sports', level: 8 },
  ],

  // Level 9: 10-11 letters
  9: [
    { id: 'gw-9-1', word: 'RENAISSANCE', clue: 'The fervent period of European cultural, artistic, and economic rebirth following the Middle Ages', category: 'World History', level: 9 },
    { id: 'gw-9-2', word: 'HIPPOCAMPUS', clue: 'The complex horseshoe-shaped brain structure vital for declarative memory formation and spatial navigation', category: 'Neuroscience', level: 9 },
    { id: 'gw-9-3', word: 'PALEONTOLOGY', clue: 'The scientific study of the history of life on Earth based on fossilized plant and animal remains', category: 'Paleontology', level: 9 },
    { id: 'gw-9-4', word: 'KALEIDOSCOPE', clue: 'An optical toy consisting of a tube containing mirrors and loose colored beads producing symmetrical patterns', category: 'Optics', level: 9 },
    { id: 'gw-9-5', word: 'PHOTOSYNTHESIS', clue: 'The biological process by which green plants synthesize nutrients from carbon dioxide and water using sunlight', category: 'Botany', level: 9 },
    { id: 'gw-9-6', word: 'ARCHIPELAGO', clue: 'An extensive group or chain of scattered islands, such as Indonesia or the Philippines', category: 'Geography', level: 9 },
    { id: 'gw-9-7', word: 'ASTROPHYSICS', clue: 'The branch of astronomy concerned with the physical properties and stellar interactions of celestial bodies', category: 'Physics', level: 9 },
    { id: 'gw-9-8', word: 'BIODIVERSITY', clue: 'The variety and variability of life on Earth across genetic, species, and ecosystem levels', category: 'Ecology', level: 9 },
    { id: 'gw-9-9', word: 'REFRIGERATOR', clue: 'An appliance or compartment artificially cooled by thermodynamic heat pumps to preserve foodstuffs', category: 'Technology', level: 9 },
    { id: 'gw-9-10', word: 'CONSTELLATION', clue: 'A recognized group of visible stars forming a perceived outline or pattern typically named after mythical figures', category: 'Astronomy', level: 9 },
  ],

  // Level 10: 11-14 letters (Master Level)
  10: [
    { id: 'gw-10-1', word: 'NEUROPLASTICITY', clue: 'The remarkable physiological capacity of the nervous system to rewire and reorganize its synaptic connections throughout life', category: 'Neuroscience', level: 10 },
    { id: 'gw-10-2', word: 'EPIDEMIOLOGY', clue: 'The medical branch dealing with the incidence, distribution, and possible control of diseases across populations', category: 'Medicine', level: 10 },
    { id: 'gw-10-3', word: 'CHROMOSOME', clue: 'A threadlike structure of nucleic acids and protein found in the nucleus of living cells carrying genetic hereditary information', category: 'Genetics', level: 10 },
    { id: 'gw-10-4', word: 'BIOTECHNOLOGY', clue: 'The exploitation of biological processes for industrial and genetic purposes, especially the genetic manipulation of microorganisms', category: 'Biotechnology', level: 10 },
    { id: 'gw-10-5', word: 'METEOROLOGY', clue: 'The branch of science concerned with the processes and phenomena of the atmosphere, especially as a means of forecasting weather', category: 'Atmospheric Science', level: 10 },
    { id: 'gw-10-6', word: 'OCEANOGRAPHY', clue: 'The branch of physical and biological science that deals with the phenomena, currents, and deep bathymetry of the ocean', category: 'Oceanography', level: 10 },
    { id: 'gw-10-7', word: 'CRYPTOGRAPHY', clue: 'The mathematical art and practice of writing or solving secure coded ciphers to protect information', category: 'Computer Science', level: 10 },
    { id: 'gw-10-8', word: 'THERMODYNAMICS', clue: 'The physical science that deals with heat, work, and temperature, and their relation to energy, radiation, and entropy', category: 'Physics', level: 10 },
    { id: 'gw-10-9', word: 'NANOTECHNOLOGY', clue: 'The branch of technology that deals with dimensions and tolerances of less than 100 nanometers, especially manipulating individual molecules', category: 'Advanced Tech', level: 10 },
    { id: 'gw-10-10', word: 'BIOENGINEERING', clue: 'The application of engineering principles and design concepts to medicine and biology for healthcare purposes', category: 'Engineering', level: 10 },
  ],
};

export function getWordsForLevel(level: number | string = 1, count: number = 5): GuessWordItem[] {
  const num = Math.max(1, Math.min(10, parseInt(String(level), 10) || 1));
  const pool = GUESS_WORD_LEVELS[num] || GUESS_WORD_LEVELS[1];
  
  // Shuffle pool using Fisher-Yates
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
