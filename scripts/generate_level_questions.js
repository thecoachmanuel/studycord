const fs = require('fs');
const path = require('path');

const fileHeader = `// Auto-generated 10-Level Dynamic Questions Pool for StudyGuru
// Contains comprehensive question sets for Levels 6 to 10 across all categories,
// plus complete 10-level sets for True & False and Daily Quiz.
import { Question } from '../types/index';

`;

// Let's create the arrays
const tfQuestions = [];
const dailyQuestions = [];
const categoryAdvancedQuestions = [];

// Helper to build Question
function makeQ(id, cat, sub, level, qText, type, optArray, correctIdx, note, extra = {}) {
  const options = optArray.map((title, i) => ({ id: `opt${i + 1}`, title }));
  return {
    id,
    category: cat,
    subcategory: sub,
    level: String(level),
    languageId: 'en',
    question: qText,
    questionType: type,
    options,
    correctAnswerOptionId: `opt${correctIdx + 1}`,
    note,
    ...extra,
  };
}

// --------------------------------------------------------------------------
// 1. TRUE & FALSE QUESTIONS (Levels 1 to 10, 5 per level)
// --------------------------------------------------------------------------
const tfData = [
  // Level 1
  [1, 'Sound travels faster through water than through air.', 0, 'Sound travels ~4.3x faster in water (approx 1,480 m/s) than in air (approx 343 m/s).'],
  [1, 'The Great Wall of China is easily visible from the Moon with the naked human eye.', 1, 'Astronauts confirm the Great Wall is not visible from lunar orbit with the naked eye.'],
  [1, 'Sharks are mammals that breathe through lungs.', 1, 'Sharks are cartilaginous fish that breathe through gills.'],
  [1, 'The Sun is a star located at the center of our Solar System.', 0, 'The Sun is a G-type main-sequence star comprising 99.8% of the Solar System mass.'],
  [1, 'Humans have five senses: sight, hearing, taste, touch, and smell.', 0, 'While these are the classical five, humans also possess proprioception, equilibrioception, and thermoception.'],

  // Level 2
  [2, 'Venus rotates clockwise (retrograde rotation), unlike the majority of planets in the Solar System.', 0, 'Venus and Uranus rotate in the opposite direction (east to west) compared to Earth.'],
  [2, 'Bananas grow on woody trees that produce traditional annual growth rings.', 1, 'The banana plant is a giant herbaceous perennial with pseudostems, not a woody tree.'],
  [2, 'Pure distilled water has a neutral pH balance of exactly 7.0 at 25°C.', 0, 'Pure water dissociates into equal concentrations of H+ and OH- ions at 25°C.'],
  [2, 'The Sahara Desert is the largest desert on planet Earth by surface area.', 1, 'Antarctica is the largest desert on Earth because it receives less than 50mm of precipitation annually.'],
  [2, 'Diamond and pencil graphite are both composed entirely of pure carbon atoms.', 0, 'Both are allotropes of carbon; differing crystal lattices account for their distinct physical properties.'],

  // Level 3
  [3, 'An adult human body typically has exactly 206 bones.', 0, 'Babies are born with ~270 bones which fuse during childhood and adolescence into 206 adult bones.'],
  [3, 'Sound waves can propagate across a vacuum if they are loud enough.', 1, 'Mechanical sound waves strictly require a material medium (solid, liquid, or gas) to propagate.'],
  [3, 'An octopus possesses three separate hearts and blue copper-based blood.', 0, 'Two branchial hearts pump blood through gills; one systemic heart circulates oxygenated hemocyanin blood.'],
  [3, 'Helium was first detected by analyzing the solar spectrum before being discovered on Earth.', 0, 'Astronomers Pierre Janssen and Norman Lockyer discovered the spectral line in 1868 during a solar eclipse.'],
  [3, 'One full rotation of Venus takes longer than its entire orbital journey around the Sun.', 0, 'A Venusian day is 243 Earth days, while its orbital year is only 225 Earth days.'],

  // Level 4
  [4, 'Mount Everest increases in elevation by several millimeters every year.', 0, 'Tectonic compression between the Indian and Eurasian plates continues to uplift the Himalayas.'],
  [4, 'Light travels faster through optical diamond than through empty space.', 1, 'Light travels at maximum velocity c in a vacuum and slows down by factor of 2.42 in diamond.'],
  [4, 'All living species of birds are warm-blooded vertebrates that lay eggs.', 0, 'Aves are endothermic amniotes characterized by feathers, toothless beaks, and hard-shelled eggs.'],
  [4, 'Water expands when it freezes from liquid into solid ice.', 0, 'The crystalline hydrogen-bonded lattice of ice is less dense than liquid water, causing expansion.'],
  [4, 'The Pacific Ocean contains more water volume than all other oceans on Earth combined.', 0, 'Covering more than 30% of Earth\'s surface, the Pacific holds over half the global ocean volume.'],

  // Level 5
  [5, 'The Earth\'s atmosphere has more carbon dioxide than nitrogen gas.', 1, 'Nitrogen makes up roughly 78% of the atmosphere, while CO2 accounts for only about 0.04%.'],
  [5, 'Electrons are significantly more massive than atomic protons.', 1, 'A proton has roughly 1,836 times more mass than an electron.'],
  [5, 'The Mariana Trench is the deepest oceanic trench on Earth.', 0, 'Challenger Deep in the Mariana Trench reaches a maximum depth of approximately 10,994 meters.'],
  [5, 'Lightning strikes generate temperatures substantially hotter than the surface of the Sun.', 0, 'A lightning bolt can reach 30,000 Kelvin, five times hotter than the Sun\'s 5,778 K surface.'],
  [5, 'Gold is the most chemically reactive metallic element on the periodic table.', 1, 'Gold is one of the least reactive metals (a noble metal), whereas francium and cesium are extremely reactive.'],

  // Level 6
  [6, 'In classical thermodynamics, heat can spontaneously flow from a colder body to a warmer body without external work.', 1, 'The Second Law of Thermodynamics (Clausius statement) states heat cannot spontaneously transfer from cold to hot.'],
  [6, 'The speed of light in a vacuum is universally constant regardless of the observer\'s inertial frame of reference.', 0, 'Special Relativity postulates that c (approx 299,792 km/s) is invariant across all inertial frames.'],
  [6, 'Mitochondria contain their own distinct circular DNA separate from the nuclear genome.', 0, 'Mitochondrial DNA (mtDNA) is inherited maternally and reflects ancient endosymbiotic bacterial origins.'],
  [6, 'The Great Oxygenation Event roughly 2.4 billion years ago was triggered by cyanobacteria performing photosynthesis.', 0, 'Cyanobacterial oxygenic photosynthesis transformed Earth\'s reducing atmosphere into an oxygen-rich environment.'],
  [6, 'Radioactive carbon-14 dating can be accurately used to date dinosaur fossils from 100 million years ago.', 1, 'Carbon-14 has a half-life of 5,730 years and cannot reliably date specimens older than approximately 50,000 years.'],

  // Level 7
  [7, 'According to the Pauli Exclusion Principle, two identical fermions cannot occupy the exact same quantum state simultaneously.', 0, 'Wolfgang Pauli formulated this principle in 1925, explaining atomic electron shell structure.'],
  [7, 'CRISPR-Cas9 originated naturally as an adaptive immune defense mechanism in bacteria and archaea against viral phages.', 0, 'Bacteria capture viral DNA spacers within CRISPR arrays to direct Cas endonucleases to destroy invading phages.'],
  [7, 'All radioactive alpha particles are identical in composition to ionized Helium-4 atomic nuclei.', 0, 'An alpha particle consists of two protons and two neutrons tightly bound, identical to a He-4 nucleus.'],
  [7, 'General relativity predicts that clocks positioned deeper within a gravitational potential well tick faster than clocks higher up.', 1, 'Gravitational time dilation dictates that clocks closer to a massive gravitational body run slower.'],
  [7, 'Tectonic plates float atop the liquid iron outer core of the Earth.', 1, 'Tectonic plates float atop the solid but ductile asthenosphere in the upper mantle, not the core.'],

  // Level 8
  [8, 'Superconductors expel all internal magnetic fields when cooled below their critical transition temperature (Meissner effect).', 0, 'The Meissner effect distinguishes a true superconductor from a merely perfect electrical conductor.'],
  [8, 'Pulsars are rapidly rotating magnetized white dwarf stars that emit periodic beams of electromagnetic radiation.', 1, 'Pulsars are highly magnetized rotating neutron stars, not white dwarfs.'],
  [8, 'Heisenberg\'s Uncertainty Principle states that position and momentum of a particle cannot be measured simultaneously with arbitrary precision.', 0, 'The product of standard deviations in position and momentum is bounded below by h-bar divided by 2.'],
  [8, 'Dark matter and dark energy together account for approximately 95% of the total mass-energy density of the observable universe.', 0, 'Ordinary baryonic matter makes up only ~5%, while dark matter (~27%) and dark energy (~68%) comprise the rest.'],
  [8, 'Enzymes lower the Gibbs free energy change (delta G) of chemical reactions to make them thermodynamically spontaneous.', 1, 'Enzymes lower the activation energy barrier (Ea) without altering initial or final thermodynamic equilibrium states (delta G).'],

  // Level 9
  [9, 'Bell\'s Theorem demonstrates that no physical theory of local hidden variables can reproduce all predictions of quantum mechanics.', 0, 'John Stewart Bell\'s 1964 theorem established that quantum entanglement involves genuine nonlocal correlations.'],
  [9, 'The cosmic microwave background radiation exhibits an almost perfect blackbody spectrum at a temperature of approximately 2.725 Kelvin.', 0, 'COBE and Planck satellite data confirmed the CMB matches a blackbody curve with peak deviation under 0.005%.'],
  [9, 'RNA polymerase requires a short DNA or RNA primer to initiate transcription of messenger RNA.', 1, 'RNA polymerase can initiate de novo synthesis without a primer, unlike DNA polymerase which requires a 3\'-OH primer.'],
  [9, 'In special relativity, the relativistic mass of an object approaches infinity as its velocity approaches the speed of light.', 0, 'As v approaches c, Lorentz factor gamma diverges toward infinity, requiring infinite energy to accelerate.'],
  [9, 'The Riemann Hypothesis conjectures that all non-trivial zeros of the Riemann zeta function have a real part equal to 1/2.', 0, 'Bernhard Riemann posed this conjecture in 1859, remaining one of the greatest unsolved problems in mathematics.'],

  // Level 10
  [10, 'Hawking radiation implies that isolated black holes will eventually lose mass and evaporate completely over astronomical timescales.', 0, 'Quantum vacuum fluctuations near the event horizon cause black holes to emit thermal radiation and lose mass.'],
  [10, 'Gödel\'s First Incompleteness Theorem states that any consistent formal mathematical system strong enough to do arithmetic cannot be both complete and consistent.', 0, 'Kurt Gödel proved in 1931 that true mathematical statements exist within such formal systems that cannot be formally proven.'],
  [10, 'Neutrinos have zero rest mass according to confirmed experimental measurements of neutrino flavor oscillations.', 1, 'Neutrino flavor oscillations conclusively prove that neutrinos have non-zero rest mass, contradicting the original Standard Model.'],
  [10, 'The holographic principle conjectures that the information contained within a volume of space can be fully represented on its boundary horizon.', 0, 'Formulated by \'t Hooft and Susskind and realized in AdS/CFT correspondence by Maldacena.'],
  [10, 'In quantum field theory, the Higgs mechanism explains why the photon and the gluon both acquire non-zero rest masses.', 1, 'The Higgs mechanism gives mass to W and Z bosons; photons and gluons remain strictly massless gauge bosons.'],
];

tfData.forEach(([lvl, q, ans, note], i) => {
  tfQuestions.push(
    makeQ(
      `tf-pool-${lvl}-${i + 1}`,
      'trueFalse',
      'tf',
      lvl,
      q,
      '2',
      ['True', 'False'],
      ans,
      note
    )
  );
});

// --------------------------------------------------------------------------
// 2. DAILY QUIZ QUESTIONS (Levels 1 to 10, 5 per level = 50 questions)
// --------------------------------------------------------------------------
const dqData = [
  // Level 1
  [1, 'What is the capital city of France?', ['Paris', 'Marseille', 'Lyon', 'Nice'], 0, 'Paris is the capital and largest city of France.'],
  [1, 'Which planet is known as the "Red Planet"?', ['Venus', 'Mars', 'Jupiter', 'Mercury'], 1, 'Iron oxide on Mars gives it a distinct reddish appearance.'],
  [1, 'How many days are in a standard leap year?', ['365', '366', '364', '367'], 1, 'A leap year has 366 days, adding February 29th.'],
  [1, 'Which gas do plants absorb from the atmosphere for photosynthesis?', ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Methane'], 1, 'Plants absorb CO2 and release oxygen during photosynthesis.'],
  [1, 'What is the chemical symbol for table salt?', ['NaCl', 'KCl', 'CaCl2', 'NaOH'], 0, 'Table salt is sodium chloride, NaCl.'],

  // Level 2
  [2, 'Who painted the famous masterpiece "The Starry Night"?', ['Pablo Picasso', 'Claude Monet', 'Vincent van Gogh', 'Salvador Dalí'], 2, 'Van Gogh painted The Starry Night in June 1889.'],
  [2, 'What is the largest living mammal on Earth?', ['African Elephant', 'Blue Whale', 'Colossal Squid', 'Giraffe'], 1, 'The blue whale can reach over 30 meters in length and weigh up to 190 metric tons.'],
  [2, 'What is the primary currency used in Japan?', ['Yuan', 'Won', 'Yen', 'Ringgit'], 2, 'The Japanese Yen (JPY) is Japan\'s official currency.'],
  [2, 'Which organ in the human body filters blood to produce urine?', ['Liver', 'Kidneys', 'Pancreas', 'Spleen'], 1, 'The kidneys filter metabolic waste products from blood.'],
  [2, 'Which geometric shape has exactly eight straight sides?', ['Hexagon', 'Heptagon', 'Octagon', 'Nonagon'], 2, 'An octagon is an eight-sided polygon.'],

  // Level 3
  [3, 'Which African nation was historically known as Abyssinia?', ['Ethiopia', 'Sudan', 'Somalia', 'Eritrea'], 0, 'Ethiopia was historically known to outsiders as Abyssinia.'],
  [3, 'What is the chemical symbol for Gold on the periodic table?', ['Ag', 'Au', 'Fe', 'Pt'], 1, 'Au comes from the Latin word "aurum", meaning shining dawn.'],
  [3, 'Who wrote the epic ancient Greek poems the Iliad and the Odyssey?', ['Socrates', 'Homer', 'Hesiod', 'Virgil'], 1, 'Homer is revered as the legendary author of the Iliad and Odyssey.'],
  [3, 'Which layer of Earth\'s atmosphere contains the ozone layer?', ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'], 1, 'The ozone layer resides within the stratosphere between 15 and 35 km above Earth.'],
  [3, 'What is the capital city of Australia?', ['Sydney', 'Melbourne', 'Canberra', 'Perth'], 2, 'Canberra was established as the national capital compromise in 1908.'],

  // Level 4
  [4, 'In which year did the Titanic sink after striking an iceberg in the North Atlantic?', ['1910', '1912', '1914', '1916'], 1, 'RMS Titanic sank on April 15, 1912.'],
  [4, 'Which element has the atomic number 6 on the periodic table?', ['Boron', 'Carbon', 'Nitrogen', 'Oxygen'], 1, 'Carbon has 6 protons and forms the structural basis of organic chemistry.'],
  [4, 'What is the deepest lake in the world by water depth?', ['Lake Superior', 'Lake Baikal', 'Lake Tanganyika', 'Caspian Sea'], 1, 'Lake Baikal in Siberia reaches a depth of 1,642 meters and holds 20% of Earth\'s unfrozen freshwater.'],
  [4, 'Which ancient empire constructed the architectural citadel of Persepolis?', ['Roman Empire', 'Achaemenid Persian Empire', 'Ottoman Empire', 'Byzantine Empire'], 1, 'Persepolis was the ceremonial capital of the Persian Achaemenid Empire under Darius I.'],
  [4, 'What is the process by which liquid water changes into gaseous water vapor?', ['Condensation', 'Sublimation', 'Evaporation', 'Deposition'], 2, 'Evaporation occurs when surface molecules gain sufficient thermal energy to escape into the vapor phase.'],

  // Level 5
  [5, 'Which English scientist formulated the Laws of Motion and Universal Gravitation in 1687?', ['Isaac Newton', 'Robert Hooke', 'Michael Faraday', 'James Clerk Maxwell'], 0, 'Sir Isaac Newton published Philosophiæ Naturalis Principia Mathematica in 1687.'],
  [5, 'What is the currency of the United Kingdom?', ['Euro', 'British Pound Sterling', 'Swiss Franc', 'Krone'], 1, 'The British Pound Sterling (GBP) is the world\'s oldest continuously used currency.'],
  [5, 'Which country features the world\'s highest uninterrupted waterfall, Angel Falls?', ['Brazil', 'Venezuela', 'Colombia', 'Peru'], 1, 'Angel Falls (Kerepakupai Merú) drops 979 meters in Canaima National Park, Venezuela.'],
  [5, 'What is the standard unit of electrical resistance in physics?', ['Volt', 'Ampere', 'Ohm', 'Watt'], 2, 'The Ohm (symbol: Ω) is named after German physicist Georg Wilhelm Ohm.'],
  [5, 'Which author wrote the 19th-century epic Russian novel "War and Peace"?', ['Fyodor Dostoevsky', 'Leo Tolstoy', 'Anton Chekhov', 'Ivan Turgenev'], 1, 'Leo Tolstoy published War and Peace in 1869.'],

  // Level 6
  [6, 'In which European city was the international treaty establishing the European Union signed in 1992?', ['Brussels', 'Maastricht', 'Rome', 'Strasbourg'], 1, 'The Maastricht Treaty was signed in the Netherlands in February 1992.'],
  [6, 'Which chemical element has the highest electrical and thermal conductivity of all metals?', ['Copper', 'Gold', 'Silver', 'Aluminum'], 2, 'Silver has the highest electrical conductivity of any known element.'],
  [6, 'Who formulated the theory of psychoanalysis and structural model of id, ego, and superego?', ['Carl Jung', 'Sigmund Freud', 'Alfred Adler', 'Jean Piaget'], 1, 'Sigmund Freud pioneered psychoanalysis in Vienna in the late 19th and early 20th centuries.'],
  [6, 'What is the official currency of Switzerland?', ['Euro', 'Swiss Franc', 'Deutsche Mark', 'Guilder'], 1, 'The Swiss Franc (CHF) is the official currency of Switzerland and Liechtenstein.'],
  [6, 'Which strait connects the Atlantic Ocean to the Mediterranean Sea?', ['Strait of Hormuz', 'Strait of Malacca', 'Strait of Gibraltar', 'Bosporus Strait'], 2, 'The Strait of Gibraltar separates Spain from Morocco.'],

  // Level 7
  [7, 'Which mathematician famously posed the Seven Bridges of Königsberg problem in 1736, founding graph theory?', ['Carl Friedrich Gauss', 'Leonhard Euler', 'Pierre de Fermat', 'Blaise Pascal'], 1, 'Leonhard Euler proved no walk could cross each bridge exactly once, laying the foundations of topology.'],
  [7, 'Which ancient civilization developed the linear script known as Cuneiform on clay tablets?', ['Phoenicians', 'Sumerians', 'Assyrians', 'Babylonians'], 1, 'Sumerians in southern Mesopotamia invented cuneiform around 3400 BCE.'],
  [7, 'Which treaty divided newly discovered non-European lands between Spain and Portugal in 1494?', ['Treaty of Utrecht', 'Treaty of Tordesillas', 'Treaty of Westphalia', 'Treaty of Versailles'], 1, 'The Treaty of Tordesillas set a meridian 370 leagues west of the Cape Verde islands.'],
  [7, 'What is the rarest naturally occurring noble gas in Earth\'s atmosphere?', ['Neon', 'Krypton', 'Xenon', 'Radon'], 3, 'Radon is a radioactive decay product and exists only in minuscule trace amounts.'],
  [7, 'Who composed the revolutionary symphony known as the "Eroica" (Symphony No. 3)?', ['W.A. Mozart', 'Ludwig van Beethoven', 'Franz Joseph Haydn', 'Johannes Brahms'], 1, 'Beethoven originally dedicated his Third Symphony to Napoleon before tearing up the title page.'],

  // Level 8
  [8, 'Which ancient anatomical structure in the human brain coordinates circadian sleep-wake rhythms?', ['Suprachiasmatic Nucleus', 'Substantia Nigra', 'Corpus Callosum', 'Amygdala'], 0, 'The suprachiasmatic nucleus (SCN) in the hypothalamus acts as the central circadian pacemaker.'],
  [8, 'What was the code name of the Allied military deception during WWII that misled German command about the invasion of Sicily?', ['Operation Overlord', 'Operation Mincemeat', 'Operation Market Garden', 'Operation Barbarossa'], 1, 'Operation Mincemeat used the corpse of a fictitious officer carrying fake battle plans.'],
  [8, 'Which economic concept describes a situation where an increase in income leads to a decrease in demand for a good?', ['Giffen Good', 'Inferior Good', 'Veblen Good', 'Normal Good'], 1, 'An inferior good sees reduced consumption as consumer purchasing power expands.'],
  [8, 'Which Roman Emperor famously divided the Roman Empire into the Western and Eastern administrative halves in 285 CE?', ['Constantine the Great', 'Diocletian', 'Augustus', 'Marcus Aurelius'], 1, 'Diocletian established the Tetrarchy to effectively govern the vast empire.'],
  [8, 'What is the principal mineral ore from which aluminum is commercially extracted?', ['Hematite', 'Bauxite', 'Galena', 'Cassiterite'], 1, 'Bauxite contains hydrated aluminum oxides refined via the Bayer and Hall-Héroult processes.'],

  // Level 9
  [9, 'Which French polymath and linguist successfully deciphered Egyptian hieroglyphics using the Rosetta Stone in 1822?', ['Jean-François Champollion', 'Thomas Young', 'Champ Fleury', 'Gaston Maspero'], 0, 'Champollion recognized that hieroglyphs represented both phonetic sounds and ideographic concepts.'],
  [9, 'Which theoretical temperature scale has its absolute zero defined at -273.15 degrees Celsius?', ['Rankine', 'Kelvin', 'Fahrenheit', 'Reaumur'], 1, 'The Kelvin thermodynamic temperature scale sets absolute zero as the complete cessation of thermal motion.'],
  [9, 'What is the philosophical paradox concerning whether an object that has had all of its components replaced remains the same object?', ['Zeno\'s Paradox', 'Ship of Theseus', 'Fermi Paradox', 'Bootstrap Paradox'], 1, 'The Ship of Theseus explores whether identity persists through gradual replacement of parts.'],
  [9, 'Which subatomic particle was predicted by Paul Dirac in 1928 as the antimatter counterpart of the electron?', ['Muon', 'Positron', 'Tau', 'Neutrino'], 1, 'The positron was experimentally confirmed in cloud chamber cosmic ray tracks by Carl Anderson in 1932.'],
  [9, 'Which pre-Socratic Greek philosopher famously declared that "Everything flows" (Panta rhei) and fire is the fundamental element?', ['Heraclitus', 'Parmenides', 'Thales', 'Anaximander'], 0, 'Heraclitus emphasized perpetual change and the unity of opposites in nature.'],

  // Level 10
  [10, 'Which unsolved mathematical problem concerning polynomial-time verification versus computation was introduced by Stephen Cook in 1971?', ['Riemann Hypothesis', 'P versus NP problem', 'Collatz Conjecture', 'Goldbach\'s Conjecture'], 1, 'The P vs NP problem asks if every problem whose solution can be efficiently verified can also be efficiently solved.'],
  [10, 'In quantum mechanics, what is the term for the quantum phenomenon where a particle tunnels through a potential energy barrier higher than its kinetic energy?', ['Quantum Entanglement', 'Quantum Tunneling', 'Quantum Decoherence', 'Quantum Zeno Effect'], 1, 'Quantum tunneling enables nuclear fusion in stars and operates modern flash memory chips.'],
  [10, 'Which diplomatic congress redrew the national boundaries of Europe following the defeat of Napoleon in 1814-1815?', ['Treaty of Utrecht', 'Congress of Vienna', 'Peace of Westphalia', 'Congress of Berlin'], 1, 'The Congress of Vienna established a balance of power in Europe that endured for decades.'],
  [10, 'Which ancient lost language script discovered in Crete remains undeciphered to this day?', ['Linear B', 'Linear A', 'Cuneiform', 'Ogham'], 1, 'Linear A was used by the Minoan civilization from 1800 to 1450 BCE and remains undeciphered.'],
  [10, 'Which cosmological constant parameter explains the observed accelerating expansion of the modern universe?', ['Baryon Density', 'Dark Energy (Lambda)', 'Hubble Constant', 'Spatial Curvature'], 1, 'Einstein\'s cosmological constant Lambda or dark energy drives universal cosmic acceleration.'],
];

dqData.forEach(([lvl, q, opts, ans, note], i) => {
  dailyQuestions.push(
    makeQ(
      `dq-pool-${lvl}-${i + 1}`,
      'dailyQuiz',
      'daily',
      lvl,
      q,
      '1',
      opts,
      ans,
      note
    )
  );
});

// --------------------------------------------------------------------------
// 3. ADVANCED CATEGORY QUESTIONS (Levels 6 to 10 for Categories 1 to 6)
// --------------------------------------------------------------------------
const catData = [
  // CATEGORY 1: GENERAL KNOWLEDGE (Levels 6 to 10)
  // L6
  ['1', '101', 6, 'Which international conference held in 1944 established the International Monetary Fund and the World Bank?', ['Yalta Conference', 'Bretton Woods Conference', 'Potsdam Conference', 'Geneva Convention'], 1, 'The Bretton Woods Conference in New Hampshire established the post-WWII monetary framework.'],
  ['1', '101', 6, 'Which ancient architectural site in southeastern Turkey is considered the oldest known temple complex in human history?', ['Çatalhöyük', 'Göbekli Tepe', 'Jericho', 'Mohenjo-daro'], 1, 'Göbekli Tepe dates to c. 9500 BCE, pre-dating pottery, metallurgy, and writing.'],
  ['1', '101', 6, 'Which European microstate is the oldest continuous constitutional republic in the world?', ['Monaco', 'San Marino', 'Liechtenstein', 'Andorra'], 1, 'San Marino was founded in 301 CE by Saint Marinus and retains its historic statutes.'],
  ['1', '101', 6, 'Who is the only person to have been awarded Nobel Prizes in two different scientific fields?', ['Linus Pauling', 'Marie Curie', 'John Bardeen', 'Albert Einstein'], 1, 'Marie Curie won the 1903 Nobel in Physics and the 1911 Nobel in Chemistry.'],
  ['1', '101', 6, 'What artificial international auxiliary language was created in 1887 by L. L. Zamenhof?', ['Ido', 'Interlingua', 'Esperanto', 'Volapük'], 2, 'Zamenhof designed Esperanto to foster international understanding and universal communication.'],

  // L7
  ['1', '101', 7, 'Which ancient Mesopotamian epic is considered the earliest surviving literary masterpiece in world history?', ['Enuma Elish', 'Epic of Gilgamesh', 'Atrahasis', 'Descent of Inanna'], 1, 'The Epic of Gilgamesh was transcribed onto clay cuneiform tablets in Akkadian.'],
  ['1', '101', 7, 'What distortion characteristic is inherent to the standard cylindrical Mercator map projection?', ['Distorts shapes near equator', 'Vastly exaggerates land areas near the poles', 'Shrinks polar oceans', 'Inverts north and south'], 1, 'The Mercator projection preserves angles and compass bearings but inflates high-latitude landmasses like Greenland.'],
  ['1', '101', 7, 'Which ancient Hellenistic mechanical computer discovered in a shipwreck in 1901 was used to track astronomical positions?', ['Phaistos Disc', 'Antikythera Mechanism', 'Archimedes Sphere', 'Astrolabe of Rhodes'], 1, 'The Antikythera mechanism dates to c. 100 BCE and contains over 30 intricate meshed bronze gears.'],
  ['1', '101', 7, 'Which international treaty signed in 1959 preserves an entire continent exclusively for peaceful scientific research?', ['Kyoto Protocol', 'Antarctic Treaty', 'Montreal Protocol', 'Svalbard Treaty'], 1, 'The Antarctic Treaty entered into force in 1961, demilitarizing the continent.'],
  ['1', '101', 7, 'In music theory, which landmark collection of preludes and fugues was composed by J.S. Bach in all 24 major and minor keys?', ['The Art of Fugue', 'The Well-Tempered Clavier', 'Goldberg Variations', 'Brandenburg Concertos'], 1, 'The Well-Tempered Clavier demonstrated the viability of well temperament tuning across all keys.'],

  // L8
  ['1', '101', 8, 'Which linguistic hypothesis posits that the structural categories of a particular language shape its speakers\' cognitive worldview?', ['Chomskyan Universal Grammar', 'Sapir-Whorf Hypothesis', 'Grimm\'s Law', 'Saussurean Semiotics'], 1, 'The Sapir-Whorf hypothesis explores linguistic relativity and cognitive framing.'],
  ['1', '101', 8, 'Which Byzantine architectural masterpiece features a massive pendentive dome that stood as the world\'s largest cathedral for nearly a millennium?', ['St. Mark\'s Basilica', 'Hagia Sophia', 'Basilica of San Vitale', 'Church of the Holy Sepulchre'], 1, 'Hagia Sophia in Constantinople was commissioned by Emperor Justinian I and completed in 537 CE.'],
  ['1', '101', 8, 'Which cryptographic machine used by the German military was cracked by Polish mathematicians and British cryptanalysts at Bletchley Park?', ['Lorenz Cipher', 'Enigma Machine', 'Sigaba', 'Typex'], 1, 'Marian Rejewski, Alan Turing, and Gordon Welchman developed electromechanical Bombes to decipher Enigma.'],
  ['1', '101', 8, 'Which philosophical treatise by Thomas Hobbes introduced the concept of the social contract under an absolute sovereign?', ['Two Treatises of Government', 'Leviathan', 'The Social Contract', 'De Cive'], 1, 'Hobbes published Leviathan in 1651, arguing life without a state is "solitary, poor, nasty, brutish, and short."'],
  ['1', '101', 8, 'In economic history, which Scottish philosopher published "The Wealth of Nations" in 1776, outlining the "invisible hand"?', ['David Hume', 'Adam Smith', 'John Stuart Mill', 'David Ricardo'], 1, 'Adam Smith\'s Inquiry into the Nature and Causes of the Wealth of Nations founded classical economics.'],

  // L9
  ['1', '101', 9, 'Which ancient trilingual stele discovered in 1799 provided the key to deciphering ancient Egyptian hieroglyphic text?', ['Palermo Stone', 'Rosetta Stone', 'Behistun Inscription', 'Mesha Stele'], 1, 'The Rosetta Stone was inscribed in Hieroglyphic, Demotic, and Ancient Greek.'],
  ['1', '101', 9, 'Which epistemological principle formulated by William of Ockham states that pluralities should not be posited without necessity?', ['Buridan\'s Principle', 'Occam\'s Razor', 'Pascal\'s Wager', 'Hume\'s Guillotine'], 1, 'Occam\'s Razor advocates that among competing hypotheses, the one with the fewest assumptions should be selected.'],
  ['1', '101', 9, 'Which ancient Indian treatise by Chanakya (Kautilya) is celebrated as a foundational text on statecraft, economic policy, and military strategy?', ['Manusmriti', 'Arthashastra', 'Upanishads', 'Mahabharata'], 1, 'The Arthashastra served as a comprehensive manual of statecraft for the Maurya Empire.'],
  ['1', '101', 9, 'Which intellectual movement of 18th-century Europe championed reason, individualism, and empirical science over religious dogma?', ['Scholasticism', 'The Age of Enlightenment', 'Romanticism', 'Existentialism'], 1, 'Thinkers like Voltaire, Rousseau, Kant, and Locke defined the Enlightenment.'],
  ['1', '101', 9, 'What is the oldest known preserved epic literature composed in Old English, featuring heroes, monsters, and dragons?', ['The Canterbury Tales', 'Beowulf', 'The Wanderer', 'Sir Gawain and the Green Knight'], 1, 'Beowulf survives in the Nowell Codex manuscript dating to circa 1000 CE.'],

  // L10
  ['1', '101', 10, 'In mathematical logic and set theory, which famous antinomy demonstrated inconsistency in Frege\'s naive set comprehension?', ['Curry\'s Paradox', 'Russell\'s Paradox', 'Berry Paradox', 'Liar Paradox'], 1, 'Bertrand Russell considered the set of all sets that do not contain themselves.'],
  ['1', '101', 10, 'Which proposed geological epoch designates the current period of Earth history dominated by profound human impact on climate and ecosystems?', ['Holocene', 'Anthropocene', 'Pleistocene', 'Pliocene'], 1, 'Paul Crutzen popularized the term Anthropocene to describe human planetary dominance.'],
  ['1', '101', 10, 'Which Bronze Age Aegean script deciphered in 1952 by Michael Ventris revealed an archaic dialect of Mycenaean Greek?', ['Linear A', 'Linear B', 'Cypriot Syllabary', 'Hieroglyphic Luwian'], 1, 'Linear B was shown to be an early syllabic script encoding Mycenaean Greek.'],
  ['1', '101', 10, 'Which 20th-century philosopher introduced the concept of "language-games" in his "Philosophical Investigations"?', ['Bertrand Russell', 'Ludwig Wittgenstein', 'G.E. Moore', 'Gottlob Frege'], 1, 'Wittgenstein argued that the meaning of words lies in their practical usage within shared forms of life.'],
  ['1', '101', 10, 'Which universal fundamental theorem proved by Kurt Gödel in 1930 established that every valid first-order logical formula is provable?', ['Incompleteness Theorem', 'Completeness Theorem', 'Compactness Theorem', 'Undecidability Theorem'], 1, 'Gödel\'s Completeness Theorem shows syntactic provability coincides with semantic validity in first-order logic.'],

  // CATEGORY 2: SCIENCE & TECHNOLOGY (Levels 6 to 10)
  // L6
  ['2', '201', 6, 'What thermodynamic cycle represents the theoretical upper limit of efficiency for any heat engine operating between two thermal reservoirs?', ['Rankine Cycle', 'Carnot Cycle', 'Otto Cycle', 'Brayton Cycle'], 1, 'Nicolas Léonard Sadi Carnot formulated the Carnot cycle and the Carnot efficiency theorem in 1824.'],
  ['2', '201', 6, 'What is the theoretical upper mass limit of a non-rotating white dwarf star, above which electron degeneracy pressure cannot prevent gravitational collapse?', ['Oppenheimer-Volkoff Limit', 'Chandrasekhar Limit', 'Schwarzschild Radius', 'Eddington Luminosity'], 1, 'Subrahmanyan Chandrasekhar calculated this limit to be approximately 1.44 solar masses.'],
  ['2', '201', 6, 'Which biochemical pathway occurring in the mitochondrial matrix oxidizes acetyl-CoA to produce NADH, FADH2, and GTP/ATP?', ['Glycolysis', 'Krebs Cycle (Citric Acid Cycle)', 'Calvin Cycle', 'Pentose Phosphate Pathway'], 1, 'Hans Krebs identified the cyclic oxidation of citric acid in 1937, yielding reducing power for oxidative phosphorylation.'],
  ['2', '201', 6, 'In modern operating systems, what is the term for the core software component that directly arbitrates hardware access and manages memory, processes, and drivers?', ['Shell', 'Kernel', 'Hypervisor', 'BIOS'], 1, 'The OS kernel executes in privileged supervisor mode, providing low-level abstractions to user space.'],
  ['2', '201', 6, 'Which chemical process links polymer chains together with sulfur bridges to enhance the elasticity and durability of natural rubber?', ['Polymerization', 'Vulcanization', 'Esterification', 'Hydrogenation'], 1, 'Charles Goodyear patented vulcanization in 1844, preventing rubber from decomposing in heat.'],

  // L7
  ['2', '201', 7, 'Which quantum relationship connects the momentum of a particle to its associated de Broglie matter wavelength?', ['E = mc²', 'lambda = h / p', 'Delta x * Delta p >= h-bar / 2', 'v = f * lambda'], 1, 'Louis de Broglie proposed that matter exhibits wave properties where wavelength equals Planck\'s constant divided by momentum.'],
  ['2', '201', 7, 'What programmable RNA-guided endonuclease enzyme system derived from Streptococcus pyogenes revolutionized molecular targeted gene editing?', ['TALENs', 'CRISPR-Cas9', 'Zinc Finger Nucleases', 'Restriction Enzyme EcoRI'], 1, 'Jennifer Doudna and Emmanuelle Charpentier shared the 2020 Nobel Prize for adapting CRISPR-Cas9 as a gene editing tool.'],
  ['2', '201', 7, 'Which spacecraft launched in 1977 became the first human-made object to cross the heliopause into interstellar space in August 2012?', ['Pioneer 10', 'Voyager 1', 'Voyager 2', 'New Horizons'], 1, 'Voyager 1 detected a sharp increase in galactic cosmic rays when crossing into interstellar space at ~121 AU.'],
  ['2', '201', 7, 'Which graph search algorithm uses a heuristic evaluation function f(n) = g(n) + h(n) to guarantee finding the shortest path efficiently?', ['Breadth-First Search', 'A* Search Algorithm', 'Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm'], 1, 'The A* search algorithm is optimal and complete when using an admissible heuristic.'],
  ['2', '201', 7, 'Which elementary particle discovered at the Large Hadron Collider in 2012 is responsible for conferring mass to fundamental W and Z gauge bosons?', ['Top Quark', 'Higgs Boson', 'Gluon', 'Graviton'], 1, 'The scalar Higgs boson confirms the Brout-Englert-Higgs mechanism of electroweak symmetry breaking.'],

  // L8
  ['2', '201', 8, 'In Einstein\'s general relativity, what is the radius of the event horizon surrounding a non-rotating, spherically symmetric black hole called?', ['Hawking Radius', 'Schwarzschild Radius', 'Kerr Radius', 'Roche Radius'], 1, 'The Schwarzschild radius rs = 2GM / c² defines the boundary from which nothing, not even light, can escape.'],
  ['2', '201', 8, 'Which epigenetic mechanism attaches methyl groups to cytosine bases in DNA to typically repress gene transcription without altering the underlying nucleotide sequence?', ['Histone Acetylation', 'DNA Methylation', 'RNA Splicing', 'Ubiquitination'], 1, 'DNA methylation at CpG dinucleotide islands is a principal mechanism of stable epigenetic gene silencing.'],
  ['2', '201', 8, 'Which microscopic theory explains conventional low-temperature superconductivity through the formation of phonon-mediated electron Cooper pairs?', ['London Theory', 'BCS Theory', 'Ginzburg-Landau Theory', 'Hubbard Model'], 1, 'John Bardeen, Leon Cooper, and John Robert Schrieffer formulated the BCS theory in 1957.'],
  ['2', '201', 8, 'Which intermediate representation property in compiler design ensures that every program variable is assigned a value exactly once?', ['Three-Address Code', 'Static Single Assignment (SSA) Form', 'Abstract Syntax Tree (AST)', 'Control Flow Graph (CFG)'], 1, 'SSA form simplifies compiler optimization passes such as dead code elimination and constant propagation.'],
  ['2', '201', 8, 'Which nuclear fusion reaction sequence in aging red giant stars fuses three alpha particles (helium-4 nuclei) into carbon-12?', ['Proton-Proton Chain', 'Triple-Alpha Process', 'CNO Cycle', 'Carbon-Burning Process'], 1, 'Fred Hoyle predicted the resonant excited state in carbon-12 that allows the triple-alpha process to proceed.'],

  // L9
  ['2', '201', 9, 'Which quantum algorithm formulated by Peter Shor in 1994 can find the prime factors of an integer in polynomial time on an ideal quantum computer?', ['Grover\'s Algorithm', 'Shor\'s Algorithm', 'Deutsch-Jozsa Algorithm', 'Simon\'s Algorithm'], 1, 'Shor\'s algorithm exploits quantum Fourier transforms to factor integers exponentially faster than classical algorithms.'],
  ['2', '201', 9, 'Which distributed consensus algorithm was published by Diego Ongaro and John Ousterhout in 2014 as an understandable alternative to Paxos?', ['Two-Phase Commit', 'Raft Consensus Algorithm', 'Byzantine Fault Tolerance', 'Chandy-Lamport Algorithm'], 1, 'Raft decomposes distributed consensus into leader election, log replication, and safety.'],
  ['2', '201', 9, 'In molecular orbital theory, what acronym denotes the energy level difference between the Highest Occupied Molecular Orbital and Lowest Unoccupied Molecular Orbital?', ['VSEPR Gap', 'HOMO-LUMO Gap', 'Band Inversion', 'Fermi Edge'], 1, 'The HOMO-LUMO gap dictates chemical reactivity, optical absorption, and electrical conductivity.'],
  ['2', '201', 9, 'What hypothetical class of weakly interacting massive subatomic particles represents a leading candidate for cold non-baryonic dark matter?', ['Axions', 'WIMPs', 'Sterile Neutrinos', 'Machos'], 1, 'Weakly Interacting Massive Particles (WIMPs) are hypothesized to interact only via gravity and the weak force.'],
  ['2', '201', 9, 'What bio-engineered biological constructs created from African clawed frog stem cells represent the world\'s first living programmable organisms?', ['Organoids', 'Xenobots', 'Bio-hybrids', 'Chimeras'], 1, 'Xenobots are microscopic synthetic biological machines configured by evolutionary algorithms.'],

  // L10
  ['2', '201', 10, 'In superstring theory, what type of compactified six-dimensional Riemannian manifolds preserve supersymmetry and provide realistic spacetime compactifications?', ['Klein Bottles', 'Calabi-Yau Manifolds', 'Riemann Surfaces', 'Möbius Manifolds'], 1, 'Calabi-Yau spaces are Kähler manifolds with vanishing first Chern class, compactifying 10-dimensional spacetime into 4 dimensions.'],
  ['2', '201', 10, 'Which graphical diagrams invented by Richard Feynman visually calculate probability amplitudes of subatomic particle interactions in quantum electrodynamics?', ['Penrose Diagrams', 'Feynman Diagrams', 'Minkowski Diagrams', 'Hasse Diagrams'], 1, 'Feynman diagrams represent perturbative expansions of the S-matrix in quantum field theory.'],
  ['2', '201', 10, 'What magnetic confinement fusion reactor design utilizes a toroidal vacuum chamber with helical magnetic fields to confine burning hydrogen plasma?', ['Inertial Confinement Chamber', 'Tokamak', 'Z-Pinch Machine', 'Magnetic Mirror'], 1, 'Tokamaks (such as ITER) use toroidal and poloidal magnetic coils to confine plasma at over 100 million Kelvin.'],
  ['2', '201', 10, 'Which thermodynamic law formulated by Stephen Hawking states that the total area of the event horizon of classical black holes can never decrease over time?', ['Hawking Evaporation Law', 'Black Hole Area Theorem', 'No-Hair Theorem', 'Cosmic Censorship Hypothesis'], 1, 'Hawking\'s area theorem parallels the non-decreasing entropy principle of the Second Law of Thermodynamics.'],
  ['2', '201', 10, 'What theoretical particle is proposed in high-energy physics to resolve the Strong CP problem via Peccei-Quinn symmetry breaking?', ['Gravitino', 'Axion', 'Majorana Fermion', 'Dilaton'], 1, 'The axion is a pseudo-Nambu-Goldstone boson and a leading dark matter candidate.'],

  // CATEGORY 3: MATHEMATICS & LOGIC (Levels 6 to 10)
  // L6
  ['3', '301', 6, 'Calculate the exact value of the logarithmic expression: log_2(128) - log_3(81)', ['1', '3', '4', '7'], 1, 'log_2(128) = 7 because 2^7 = 128. log_3(81) = 4 because 3^4 = 81. 7 - 4 = 3.', { mathEquation: '\\log_2(128) - \\log_3(81) = ?' }],
  ['3', '301', 6, 'What is the sum of all interior angles of a convex regular hexagon in degrees?', ['540°', '720°', '900°', '1080°'], 1, 'Formula: (n - 2) * 180°. For n = 6: (6 - 2) * 180° = 4 * 180° = 720°.', { mathEquation: 'S = (n - 2) \\times 180^{\\circ}' }],
  ['3', '301', 6, 'Solve the quadratic equation x^2 - 14x + 49 = 0 for the single real root x:', ['x = -7', 'x = 7', 'x = 14', 'x = 49'], 1, 'Factoring: (x - 7)^2 = 0, so x = 7.', { mathEquation: 'x^2 - 14x + 49 = 0' }],
  ['3', '301', 6, 'What is the exact numerical value of sin^2(37°) + cos^2(37°)?', ['0', '1', '0.5', '2'], 1, 'The fundamental Pythagorean trigonometric identity states sin^2(theta) + cos^2(theta) = 1 for all angles.', { mathEquation: '\\sin^2(37^{\\circ}) + \\cos^2(37^{\\circ}) = ?' }],
  ['3', '301', 6, 'Find the sum of the infinite geometric series: 12 + 6 + 3 + 1.5 + ...', ['20', '24', '28', '36'], 1, 'Formula S = a / (1 - r). Here a = 12, r = 0.5. S = 12 / (1 - 0.5) = 12 / 0.5 = 24.', { mathEquation: 'S_{\\infty} = \\frac{a}{1 - r}, \\quad a = 12, r = 0.5' }],

  // L7
  ['3', '301', 7, 'Compute the first derivative of the function f(x) = 5x^3 - 4x^2 + 7x - 9 at x = 2:', ['51', '55', '59', '63'], 0, 'f\'(x) = 15x^2 - 8x + 7. At x = 2: 15(4) - 8(2) + 7 = 60 - 16 + 7 = 51.', { mathEquation: 'f\'(2) \\text{ for } f(x) = 5x^3 - 4x^2 + 7x - 9' }],
  ['3', '301', 7, 'Evaluate the definite integral: \\int_0^3 (4x + 2) dx', ['20', '24', '28', '32'], 1, 'Antiderivative is 2x^2 + 2x. Evaluated from 0 to 3: 2(9) + 2(3) - 0 = 18 + 6 = 24.', { mathEquation: '\\int_0^3 (4x + 2) \\, dx' }],
  ['3', '301', 7, 'What is the limit of (sin(5x) / x) as x approaches 0?', ['0', '5', '1', 'Undefined'], 1, 'Using L\'Hopital\'s Rule or standard limit identity: lim_{x->0} sin(kx)/x = k. Here k = 5.', { mathEquation: '\\lim_{x \\to 0} \\frac{\\sin(5x)}{x}' }],
  ['3', '301', 7, 'If f(x) = e^(3x), find f\'\'(x) (the second derivative):', ['3e^(3x)', '9e^(3x)', '6e^(3x)', '27e^(3x)'], 1, 'f\'(x) = 3e^(3x), f\'\'(x) = 9e^(3x).', { mathEquation: '\\frac{d^2}{dx^2}\\left(e^{3x}\\right)' }],
  ['3', '301', 7, 'Find the radius of convergence for the Taylor series expansion of f(x) = 1 / (1 - x) centered at 0:', ['R = 0.5', 'R = 1', 'R = 2', 'R = infinity'], 1, 'The geometric series sum_{n=0}^inf x^n converges strictly for |x| < 1, so radius R = 1.', { mathEquation: '\\sum_{n=0}^{\\infty} x^n = \\frac{1}{1 - x}' }],

  // L8
  ['3', '301', 8, 'What is the determinant of the 2x2 matrix: [[5, 3], [4, 6]]?', ['14', '18', '22', '30'], 1, 'det = (5 * 6) - (3 * 4) = 30 - 12 = 18.', { mathEquation: '\\det \\begin{pmatrix} 5 & 3 \\\\ 4 & 6 \\end{pmatrix}' }],
  ['3', '301', 8, 'Which iconic identity known as Euler\'s Identity connects e, i, pi, 1, and 0?', ['e^(i*pi) - 1 = 0', 'e^(i*pi) + 1 = 0', 'e^(pi) + i = 0', 'e^(2*pi) = 1'], 1, 'Euler\'s identity e^(i*pi) + 1 = 0 links five fundamental mathematical constants in a single equation.', { mathEquation: 'e^{i\\pi} + 1 = 0' }],
  ['3', '301', 8, 'What are the eigenvalues of the diagonal matrix: [[4, 0], [0, 9]]?', ['lambda = 2, 3', 'lambda = 4, 9', 'lambda = 13, 36', 'lambda = 0, 0'], 1, 'For a diagonal matrix, the eigenvalues are simply the entries along the main diagonal: 4 and 9.', { mathEquation: 'A = \\begin{pmatrix} 4 & 0 \\\\ 0 & 9 \\end{pmatrix}' }],
  ['3', '301', 8, 'What is the modulus (absolute value) of the complex number z = 5 + 12i?', ['13', '15', '17', '25'], 0, '|z| = sqrt(5^2 + 12^2) = sqrt(25 + 144) = sqrt(169) = 13.', { mathEquation: '|z| = \\sqrt{5^2 + 12^2}' }],
  ['3', '301', 8, 'What is the trace of the 3x3 identity matrix I_3?', ['0', '1', '3', '9'], 2, 'The trace is the sum of main diagonal elements: 1 + 1 + 1 = 3.', { mathEquation: '\\text{Tr}(I_3) = \\sum_{i=1}^3 1' }],

  // L9
  ['3', '301', 9, 'In combinatorics, how many distinct ways can a committee of 3 people be chosen from a group of 8 candidates?', ['24', '56', '336', '512'], 1, 'C(8, 3) = 8! / (3! * 5!) = (8 * 7 * 6) / (3 * 2 * 1) = 56.', { mathEquation: '\\binom{8}{3} = \\frac{8!}{3!5!}' }],
  ['3', '301', 9, 'According to Fermat\'s Little Theorem, what is the remainder when 3^16 is divided by the prime number 17?', ['0', '1', '3', '16'], 1, 'Fermat\'s Little Theorem states a^(p-1) congruent to 1 (mod p) for any prime p not dividing a.', { mathEquation: '3^{16} \\equiv ? \\pmod{17}' }],
  ['3', '301', 9, 'In probability, if events A and B are independent with P(A) = 0.4 and P(B) = 0.5, what is P(A or B)?', ['0.7', '0.9', '0.2', '0.5'], 0, 'P(A or B) = P(A) + P(B) - P(A and B) = 0.4 + 0.5 - (0.4 * 0.5) = 0.9 - 0.2 = 0.7.', { mathEquation: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)' }],
  ['3', '301', 9, 'What is the value of the 10th Fibonacci number F_10 (where F_1 = 1, F_2 = 1, F_3 = 2, ...)?', ['34', '55', '89', '144'], 1, 'Sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55. F_10 = 55.', { mathEquation: 'F_{n} = F_{n-1} + F_{n-2}, \\quad F_{10} = ?' }],
  ['3', '301', 9, 'In modular arithmetic, what is the modular multiplicative inverse of 3 modulo 11?', ['2', '4', '7', '8'], 1, '3 * 4 = 12. 12 mod 11 = 1. Therefore, 4 is the modular inverse of 3 mod 11.', { mathEquation: '3x \\equiv 1 \\pmod{11}' }],

  // L10
  ['3', '301', 10, 'In abstract algebra, Lagrange\'s Theorem states that for any finite group G and subgroup H:', ['The order of H divides the order of G', 'G is always abelian', 'H is always a normal subgroup', 'The index of H is always prime'], 0, 'Lagrange\'s theorem states |G| = [G:H] * |H|, so |H| must divide |G|.', { mathEquation: '|H| \\text{ divides } |G|' }],
  ['3', '301', 10, 'What is the Euler characteristic chi = V - E + F for any convex three-dimensional polyhedron homeomorphic to a sphere?', ['0', '1', '2', '4'], 2, 'Euler\'s formula states V - E + F = 2 for any planar or spherical polyhedral graph.', { mathEquation: '\\chi = V - E + F = 2' }],
  ['3', '301', 10, 'Which major theorem in number theory states that the number of primes less than or equal to x is asymptotically x / ln(x)?', ['Prime Number Theorem', 'Dirichlet\'s Theorem', 'Goldbach Conjecture', 'Green-Tao Theorem'], 0, 'Hadamard and de la Vallée Poussin independently proved the Prime Number Theorem in 1896.', { mathEquation: '\\pi(x) \\sim \\frac{x}{\\ln(x)}' }],
  ['3', '301', 10, 'In topology, two topological spaces are called homeomorphic if there exists a bijection between them that is:', ['Continuous with a continuous inverse', 'Differentiable of all orders', 'Isometric and distance-preserving', 'Linear and orthogonal'], 0, 'A homeomorphism is an isomorphism in the category of topological spaces (continuous bidirectional map).', { mathEquation: 'f: X \\to Y \\text{ is continuous and has continuous inverse}' }],
  ['3', '301', 10, 'Which celebrated conjecture proved by Grigori Perelman in 2003 states that every simply connected, closed 3-manifold is homeomorphic to the 3-sphere?', ['Poincaré Conjecture', 'Hodge Conjecture', 'Birch and Swinnerton-Dyer Conjecture', 'Novikov Conjecture'], 0, 'Perelman used Richard Hamilton\'s Ricci flow with surgery to prove Thurston\'s geometrization and the Poincaré conjecture.', { mathEquation: '\\pi_1(M^3) = 0 \\implies M^3 \\cong S^3' }],

  // CATEGORY 4: HISTORY & GEOGRAPHY (Levels 6 to 10)
  // L6
  ['4', '401', 6, 'Which historic event on May 29, 1453 marked the fall of the Byzantine Empire and the rise of Ottoman dominance in Southeastern Europe?', ['Fall of Constantinople', 'Siege of Vienna', 'Battle of Lepanto', 'Battle of Manzikert'], 0, 'Sultan Mehmed II conquered Constantinople, ending the Eastern Roman Empire after 1,123 years.'],
  ['4', '401', 6, 'What pre-Columbian Mesoamerican capital city was built on an island in Lake Texcoco by the Mexica (Aztec) people?', ['Teotihuacan', 'Tenochtitlan', 'Tula', 'Cholula'], 1, 'Tenochtitlan featured causeways and chinampa floating gardens, founded in 1325 CE.'],
  ['4', '401', 6, 'Which major Central Asian oasis city on the ancient Silk Road was celebrated as the splendid capital of Timur (Tamerlane)?', ['Bukhara', 'Samarkand', 'Khiva', 'Tashkent'], 1, 'Samarkand in modern Uzbekistan is famous for the Registan square and blue-tiled madrasahs.'],
  ['4', '401', 6, 'Which Portuguese explorer was the first European to navigate around the southern tip of Africa (the Cape of Good Hope) in 1488?', ['Vasco da Gama', 'Bartolomeu Dias', 'Ferdinand Magellan', 'Prince Henry the Navigator'], 1, 'Dias named it the Cape of Storms, later renamed Cape of Good Hope by King John II.'],
  ['4', '401', 6, 'Which Scottish inventor patented a separate condenser in 1769, drastically improving the fuel efficiency of the steam engine?', ['Thomas Newcomen', 'James Watt', 'Richard Arkwright', 'George Stephenson'], 1, 'Watt\'s condenser eliminated the waste of repeatedly heating and cooling the engine cylinder.'],

  // L7
  ['4', '401', 7, 'Which series of peace treaties signed in 1648 concluded the devastating Thirty Years\' War and established modern sovereign statehood?', ['Treaty of Utrecht', 'Peace of Westphalia', 'Treaty of Aachen', 'Treaty of Madrid'], 1, 'The Peace of Westphalia established the principle of national sovereignty (Westphalian sovereignty).'],
  ['4', '401', 7, 'Which 14th-century ruler of the Mali Empire is widely regarded as one of the wealthiest individuals in human history following his 1324 pilgrimage to Mecca?', ['Sundiata Keita', 'Mansa Musa', 'Askia the Great', 'Sonni Ali'], 1, 'Mansa Musa distributed so much gold in Cairo that he caused significant inflation across the region.'],
  ['4', '401', 7, 'Which massive geological transform fault runs roughly 1,200 kilometers through California between the Pacific and North American plates?', ['Hayward Fault', 'San Andreas Fault', 'Cascadia Fault', 'New Madrid Fault'], 1, 'The San Andreas Fault is a right-lateral strike-slip fault capable of generating major earthquakes.'],
  ['4', '401', 7, 'What supercontinent began breaking apart approximately 200 million years ago to form Laurasia and Gondwana?', ['Rodinia', 'Pangea', 'Columbia', 'Kenorland'], 1, 'Alfred Wegener proposed Pangea in his theory of continental drift in 1912.'],
  ['4', '401', 7, 'Which decisive naval engagement in 31 BCE saw Octavian defeat the joint fleet of Mark Antony and Cleopatra, securing Roman imperial rule?', ['Battle of Actium', 'Battle of Salamis', 'Battle of Pharsalus', 'Battle of Philippi'], 0, 'The victory at Actium led Octavian to become Augustus, the first Roman Emperor.'],

  // L8
  ['4', '401', 8, 'What intense 13-day confrontation in October 1962 brought the United States and the Soviet Union closest to direct nuclear warfare?', ['Berlin Airlift', 'Cuban Missile Crisis', 'Suez Crisis', 'Sino-Soviet Border Conflict'], 1, 'President JFK and Premier Khrushchev reached an agreement to dismantle Soviet missiles in Cuba.'],
  ['4', '401', 8, 'Which 1955 conference held in Indonesia brought together 29 newly independent Asian and African nations to promote non-alignment and anti-colonialism?', ['Bandung Conference', 'Non-Aligned Summit of Cairo', 'Casablanca Conference', 'Belgrade Conference'], 0, 'The Bandung Conference laid the geopolitical foundation for the Non-Aligned Movement.'],
  ['4', '401', 8, 'What is the deepest known location on the seabed of planet Earth, located within the Mariana Trench?', ['Puerto Rico Trench', 'Challenger Deep', 'Java Trench', 'Milwaukee Deep'], 1, 'Challenger Deep reaches approximately 10,994 meters below sea level in the western Pacific.'],
  ['4', '401', 8, 'Which 1917 political revolution led by Vladimir Lenin and the Bolsheviks overthrew the Russian Provisional Government?', ['February Revolution', 'October Revolution (Bolshevik Revolution)', 'Decembrist Revolt', '1905 Revolution'], 1, 'The October Revolution established Soviet rule and led to the creation of the USSR.'],
  ['4', '401', 8, 'What vast geological fracture system extends over 6,000 kilometers from Lebanon in the north to Mozambique in Southeastern Africa?', ['Mid-Atlantic Ridge', 'East African Rift System', 'Great Escarpment', 'Baikal Rift Zone'], 1, 'The East African Rift is actively splitting the African continent into two separate plates.'],

  // L9
  ['4', '401', 9, 'Which revolutionary political transformation in Japan restored direct imperial rule under Emperor Meiji in 1868, ending the Tokugawa shogunate?', ['Taika Reform', 'Meiji Restoration', 'Boshin War Accords', 'Taisho Democracy'], 1, 'The Meiji Restoration propelled rapid modernization, industrialization, and global engagement in Japan.'],
  ['4', '401', 9, 'Which ancient Sumerian settlement in southern Iraq is widely recognized by archaeologists as one of the world\'s very first true cities?', ['Jericho', 'Uruk', 'Babylon', 'Persepolis'], 1, 'Uruk emerged as a massive urban hub around 4000 BCE with monument temples and early writing.'],
  ['4', '401', 9, 'What cyclical variations in Earth\'s orbital eccentricity, axial tilt, and precession drive long-term Quaternary glacial and interglacial ice ages?', ['Milankovitch Cycles', 'Wilson Cycles', 'Chandler Wobbles', 'Solar Sunspot Cycles'], 0, 'Serbian geophysicist Milutin Milanković calculated how astronomical orbital cycles alter solar insolation.'],
  ['4', '401', 9, 'Which elite military corps and standing infantry force served as the personal bodyguard of Ottoman Sultans from the 14th century to 1826?', ['Mamluks', 'Janissaries', 'Sipahis', 'Varangian Guard'], 1, 'The Janissaries were originally recruited via the devshirme child levy system.'],
  ['4', '401', 9, 'Which secret agreement concluded in 1916 between Britain and France partitioned the future spheres of control in the Ottoman Middle East?', ['Balfour Declaration', 'Sykes-Picot Agreement', 'Treaty of Sèvres', 'McMahon-Hussein Correspondence'], 1, 'The Sykes-Picot Agreement drew artificial imperial borders dividing Syria, Iraq, and Lebanon.'],

  // L10
  ['4', '401', 10, 'Which major urban center of the ancient Indus Valley Civilization featured sophisticated civic brick planning, hydraulic drainage, and the "Great Bath"?', ['Harappa', 'Mohenjo-daro', 'Lothal', 'Dholavira'], 1, 'Mohenjo-daro in Sindh, Pakistan flourished c. 2500 BCE with unparalleled sanitary engineering.'],
  ['4', '401', 10, 'Which monumental diplomatic assembly hosted by Klemens von Metternich in 1814-1815 reconstructed the European order following the Napoleonic Wars?', ['Congress of Berlin', 'Congress of Vienna', 'Treaty of Paris', 'Concert of Europe Protocol'], 1, 'The Congress of Vienna established the Concert of Europe and preserved major-power stability for decades.'],
  ['4', '401', 10, 'Which disputed international boundary drawn in 1893 separates modern Afghanistan and Pakistan, dividing Pashtun tribal territories?', ['Radcliffe Line', 'Durand Line', 'McMahon Line', 'Curzon Line'], 1, 'Sir Mortimer Durand drew the 2,670 km border between British India and the Emirate of Afghanistan.'],
  ['4', '401', 10, 'Which massive tectonic orogeny occurred when the Indian continental plate collided with the Eurasian plate roughly 50 million years ago?', ['Appalachian Orogeny', 'Himalayan Orogeny', 'Alpine Orogeny', 'Caledonian Orogeny'], 1, 'The ongoing continental collision continues to elevate the Tibetan Plateau and the Himalayas.'],
  ['4', '401', 10, 'Which Mauryan Emperor converted to Buddhism and engraved edicts on morality, non-violence, and religious tolerance onto stone pillars across South Asia?', ['Chandragupta Maurya', 'Ashoka the Great', 'Bindusara', 'Harsha'], 1, 'Ashoka embraced Ahimsa (non-violence) following the devastating Kalinga War in 261 BCE.'],

  // CATEGORY 5: SPORTS & GAMES (Levels 6 to 10)
  // L6
  ['5', '501', 6, 'Which legendary football player is the only person to win three FIFA World Cup tournaments as an active player (1958, 1962, 1970)?', ['Diego Maradona', 'Pelé (Edson Arantes do Nascimento)', 'Zinedine Zidane', 'Lionel Messi'], 1, 'Pelé won three World Cups with Brazil, scoring in the 1958 and 1970 finals.'],
  ['5', '501', 6, 'What is the current official men\'s 100-meter world record set by Usain Bolt at the 2009 World Championships in Berlin?', ['9.69 seconds', '9.58 seconds', '9.63 seconds', '9.52 seconds'], 1, 'Usain Bolt clocked 9.58s with a top speed exceeding 44.7 km/h.'],
  ['5', '501', 6, 'In the game of chess, which opening move is characterized by White playing 1. e4 and Black responding with 1... c5?', ['French Defense', 'Sicilian Defense', 'Caro-Kann Defense', 'Ruy Lopez'], 1, 'The Sicilian Defense is Black\'s most popular and combative counter to 1. e4.'],
  ['5', '501', 6, 'Which tennis champion holds the men\'s all-time record of 14 singles titles at Roland Garros (the French Open)?', ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Björn Borg'], 1, 'Rafael Nadal\'s 14 titles on clay at Roland Garros represent unprecedented dominance at a single Grand Slam.'],
  ['5', '501', 6, 'Which basketball legend scored 100 points in a single NBA game on March 2, 1962 for the Philadelphia Warriors?', ['Michael Jordan', 'Wilt Chamberlain', 'Kareem Abdul-Jabbar', 'Bill Russell'], 1, 'Wilt Chamberlain achieved the historic 100-point record against the New York Knicks in Hershey, PA.'],

  // L7
  ['5', '501', 7, 'Which two drivers share the all-time record for the most Formula 1 World Drivers\' Championships with 7 titles each?', ['Ayrton Senna & Alain Prost', 'Michael Schumacher & Lewis Hamilton', 'Sebastian Vettel & Max Verstappen', 'Niki Lauda & Juan Manuel Fangio'], 1, 'Schumacher (1994, 1995, 2000-2004) and Hamilton (2008, 2014-2015, 2017-2020) each hold 7 titles.'],
  ['5', '501', 7, 'In the men\'s Olympic decathlon, how many distinct track and field events are contested over the two days of competition?', ['8 events', '10 events', '12 events', '14 events'], 1, 'The decathlon consists of 10 events: 100m, long jump, shot put, high jump, 400m, 110m hurdles, discus, pole vault, javelin, and 1500m.'],
  ['5', '501', 7, 'Which historic 1972 World Chess Championship match in Reykjavik, dubbed the "Match of the Century", featured Bobby Fischer defeating Boris Spassky?', ['Fischer vs Karpov', 'Fischer vs Spassky', 'Kasparov vs Karpov', 'Tal vs Botvinnik'], 1, 'American Bobby Fischer defeated Soviet defending champion Boris Spassky during the height of the Cold War.'],
  ['5', '501', 7, 'Which Belgian cyclist nicknamed "The Cannibal" won the Tour de France five times and holds the record for most Grand Tour stage victories?', ['Jacques Anquetil', 'Eddy Merckx', 'Bernard Hinault', 'Miguel Indurain'], 1, 'Eddy Merckx dominated professional cycling in the late 1960s and 1970s.'],
  ['5', '501', 7, 'What is the oldest recurring bilateral international test cricket trophy, contested between England and Australia since 1882?', ['Border-Gavaskar Trophy', 'The Ashes', 'Wisden Trophy', 'Chappell-Hadlee Trophy'], 1, 'The Ashes urn originated after The Sporting Times published an obituary declaring English cricket was dead.'],

  // L8
  ['5', '501', 8, 'Which revolutionary tactical philosophy developed in Dutch football by Rinus Michels and Johan Cruyff emphasizes fluid player interchangeability?', ['Catenaccio', 'Total Football (Totaalvoetbal)', 'Tiki-Taka', 'Gegenpressing'], 1, 'Total Football allowed any outfield player to take over the role of any other player in the team.'],
  ['5', '501', 8, 'In 1997, which IBM supercomputer defeated reigning World Chess Champion Garry Kasparov in a six-game classical match?', ['Watson', 'Deep Blue', 'AlphaZero', 'Stockfish'], 1, 'Deep Blue won game 6 in 19 moves, marking the first time a machine defeated a world champion in standard match play.'],
  ['5', '501', 8, 'The official modern Olympic marathon race distance of 42.195 kilometers (26 miles 385 yards) was established at which 1908 Olympic Games?', ['Athens 1896', 'London 1908', 'Paris 1900', 'Stockholm 1912'], 1, 'The distance was set to run from Windsor Castle to the royal box at White City Stadium in London.'],
  ['5', '501', 8, 'Which prestigious biennial team golf competition pits twelve players from the United States against twelve players from Europe?', ['Presidents Cup', 'Ryder Cup', 'Walker Cup', 'Curtis Cup'], 1, 'The Ryder Cup was established by Samuel Ryder in 1927.'],
  ['5', '501', 8, 'Which esports title hosts the annual "The International" tournament, which set historical esports records for multi-million-dollar crowd-funded prize pools?', ['League of Legends', 'Dota 2', 'Counter-Strike: Global Offensive', 'StarCraft II'], 1, 'Valve\'s Dota 2 The International 10 awarded a record prize pool exceeding $40 million.'],

  // L9
  ['5', '501', 9, 'In the game of chess, what term describes a position where a player whose turn it is to move is forced to make a move that critically worsens their position?', ['Stalemate', 'Zugzwang', 'Zwischenzug', 'En Passant'], 1, 'Zugzwang is a German term meaning "compulsion to move" where every available move loses ground.'],
  ['5', '501', 9, 'In the Ancient Olympic Games, what brutal combat sport combined boxing, wrestling, and kicking with virtually no rules other than no biting and no gouging?', ['Pankration', 'Pyx', 'Pale', 'Hoplitodromos'], 0, 'Pankration was introduced in the 33rd Olympiad in 648 BCE as the ultimate test of all-in martial combat.'],
  ['5', '501', 9, 'Which legendary NFL quarterback engineered the largest comeback in Super Bowl history, overcoming a 28-3 deficit in Super Bowl LI?', ['Peyton Manning', 'Tom Brady', 'Joe Montana', 'Aaron Rodgers'], 1, 'Tom Brady and the New England Patriots rallied to defeat the Atlanta Falcons 34-28 in overtime.'],
  ['5', '501', 9, 'In track and field, what revolutionary high jump technique introduced by Dick Fosbury at the 1968 Mexico City Olympics transformed the sport?', ['Western Roll', 'Fosbury Flop', 'Straddle Technique', 'Scissors Jump'], 1, 'Fosbury jumped back-first over the bar, lowering the jumper\'s center of mass below the bar.'],
  ['5', '501', 9, 'In association football, in which year was the modern offside rule amended so that an attacking player is not offside if level with the second-to-last defender?', ['1974', '1990', '2002', '1982'], 1, 'FIFA amended Law 11 in 1990 to encourage attacking play and more goals.'],

  // L10
  ['5', '501', 10, 'In professional chess, what mathematical rating system formulated by a Hungarian-American physics professor calculates relative player skill levels?', ['Glicko System', 'Elo Rating System', 'TrueSkill', 'Sonneborn-Berger System'], 1, 'Arpad Elo developed the Elo rating system adopted by FIDE in 1970.'],
  ['5', '501', 10, 'Which historic 1954 FIFA World Cup Final saw West Germany unexpectedly defeat the seemingly invincible "Mighty Magyars" of Hungary 3-2?', ['Miracle on Ice', 'Miracle of Bern (Das Wunder von Bern)', 'Maracanazo', 'Battle of Santiago'], 1, 'West Germany overcame a two-goal deficit in rainy conditions in Bern, Switzerland.'],
  ['5', '501', 10, 'Which rule of the Olympic Charter strictly prohibits political, religious, or racial demonstrations or propaganda at Olympic venues?', ['Rule 40', 'Rule 50', 'Rule 28', 'Rule 61'], 1, 'Rule 50 of the Olympic Charter aims to keep the Olympic Games neutral and separate from political division.'],
  ['5', '501', 10, 'Who is revered in American sports history as the "Father of American Football" for introducing the line of scrimmage, downs, and snaps at Yale in the late 19th century?', ['Knute Rockne', 'Walter Camp', 'Pop Warner', 'Amos Alonzo Stagg'], 1, 'Walter Camp spearheaded the rules conventions separating American football from rugby.'],
  ['5', '501', 10, 'Which mountain was the last of the world\'s fourteen eight-thousanders (peaks over 8,000 meters) to be successfully summited in winter (completed by a Nepali team in January 2021)?', ['Annapurna', 'K2 (Mount Godwin-Austen)', 'Nanga Parbat', 'Kanchenjunga'], 1, 'Ten Nepali mountaineers led by Nirmal Purja and Mingma G made history summiting K2 in brutal winter.'],

  // CATEGORY 6: ELITE PREMIUM MASTERCLASS (Levels 6 to 10)
  // L6
  ['6', '601', 6, 'Which moral philosophy formulated by Immanuel Kant posits that one should act only according to maxims that could become universal laws?', ['Utilitarianism', 'Categorical Imperative', 'Virtue Ethics', 'Hedonism'], 1, 'Kant\'s deontological ethics asserts moral duties derived from pure reason via the Categorical Imperative.'],
  ['6', '601', 6, 'Which macroeconomic model developed by John Hicks depicts the relationship between interest rates and real output in the goods and money markets?', ['Solow-Swan Model', 'IS-LM Model', 'Phillips Curve', 'Mundell-Fleming Model'], 1, 'The Investment-Savings / Liquidity-Money (IS-LM) model synthesizes Keynesian macroeconomic equilibrium.'],
  ['6', '601', 6, 'Which influential early 20th-century German design and architecture school founded by Walter Gropius embraced the unity of art, craft, and technology?', ['Art Nouveau', 'Bauhaus', 'De Stijl', 'Constructivism'], 1, 'The Bauhaus school in Weimar, Dessau, and Berlin shaped modern minimalist industrial and architectural design.'],
  ['6', '601', 6, 'In Aristotelian ethics, what term designates the supreme human good, commonly translated as "flourishing" or "living well"?', ['Ataraxia', 'Eudaimonia', 'Hedone', 'Arete'], 1, 'Aristotle\'s Nicomachean Ethics identifies eudaimonia as activity of the soul in accordance with virtue.'],
  ['6', '601', 6, 'Which cognitive bias causes people to rely too heavily on the first piece of information encountered when making subsequent decisions?', ['Confirmation Bias', 'Anchoring Bias', 'Availability Heuristic', 'Hindsight Bias'], 1, 'Anchoring bias skews numerical judgments toward initial reference values.'],

  // L7
  ['7', '601', 7, 'In non-cooperative game theory, what solution concept occurs when no player has an incentive to unilaterally deviate from their chosen strategy?', ['Pareto Optimality', 'Nash Equilibrium', 'Minimax Solution', 'Dominant Strategy'], 1, 'John Nash demonstrated in 1950 that every finite game has at least one mixed-strategy equilibrium.'],
  ['7', '601', 7, 'Which financial mathematical model developed by Fischer Black, Myron Scholes, and Robert Merton provides an analytical pricing formula for European options?', ['Capital Asset Pricing Model (CAPM)', 'Black-Scholes-Merton Model', 'Binomial Options Pricing Model', 'Fama-French Model'], 1, 'The Black-Scholes formula revolutionized financial derivatives trading and risk management.'],
  ['7', '601', 7, 'Which Danish philosopher explored the leap of faith and existential dread in his 1843 masterpiece "Fear and Trembling"?', ['Jean-Paul Sartre', 'Søren Kierkegaard', 'Friedrich Nietzsche', 'Albert Camus'], 1, 'Kierkegaard wrote under the pseudonym Johannes de silentio, analyzing Abraham\'s sacrifice of Isaac.'],
  ['7', '601', 7, 'Which legendary American architect pioneered "Organic Architecture", designing the landmark cantilevered home "Fallingwater"?', ['Louis Sullivan', 'Frank Lloyd Wright', 'Mies van der Rohe', 'I.M. Pei'], 1, 'Frank Lloyd Wright integrated structures harmoniously into surrounding natural ecosystems.'],
  ['7', '601', 7, 'Which cognitive heuristic causes people to evaluate the probability of an event based on how easily examples immediately come to mind?', ['Representative Heuristic', 'Availability Heuristic', 'Affect Heuristic', 'Scarcity Heuristic'], 1, 'Amos Tversky and Daniel Kahneman identified the availability heuristic in behavioral economics.'],

  // L8
  ['8', '601', 8, 'In 20th-century phenomenology, which German philosopher introduced the method of "epoché" (phenomenological reduction) to bracket preconceptions about the objective world?', ['Martin Heidegger', 'Edmund Husserl', 'Hans-Georg Gadamer', 'Paul Ricoeur'], 1, 'Husserl urged philosophers to return "to the things themselves" by suspending natural assumptions.'],
  ['8', '601', 8, 'Which Swiss linguist\'s posthumously published "Course in General Linguistics" established structural linguistics and the distinction between signifier and signified?', ['Roman Jakobson', 'Ferdinand de Saussure', 'Noam Chomsky', 'Claude Lévi-Strauss'], 1, 'De Saussure analyzed language (langue) as a formal system of arbitrary signs.'],
  ['8', '601', 8, 'In political philosophy, what hypothetical cognitive position proposed by John Rawls asks individuals to design a just society without knowing their own social status or talents?', ['State of Nature', 'Veil of Ignorance (Original Position)', 'Panopticon', 'Categorical Standpoint'], 1, 'Rawls formulated the Veil of Ignorance in "A Theory of Justice" (1971) to ensure fairness in principles of justice.'],
  ['8', '601', 8, 'Which economic theory asserts that exchange rates between currencies are in equilibrium when their purchasing power is the same in each of the two countries?', ['Interest Rate Parity', 'Purchasing Power Parity (PPP)', 'Covered Arbitrage', 'BOP Model'], 1, 'PPP states that in the absence of transaction costs and trade barriers, identical baskets of goods should cost the same.'],
  ['8', '601', 8, 'Which existentialist concept introduced by Friedrich Nietzsche challenges an individual to live their life in such a manner that they would joyfully desire to repeat every moment eternally?', ['Übermensch', 'Eternal Recurrence (Eternal Return)', 'Will to Power', 'Amor Fati'], 1, 'Nietzsche posed eternal return in "The Gay Science" and "Thus Spoke Zarathustra" as the supreme test of life-affirmation.'],

  // L9
  ['9', '601', 9, 'In legal philosophy, which British legal positivist published "The Concept of Law" in 1961, introducing the distinction between primary and secondary rules?', ['Lon Fuller', 'H.L.A. Hart', 'Ronald Dworkin', 'John Austin'], 1, 'H.L.A. Hart emphasized the "rule of recognition" as the ultimate criteria of legal validity.'],
  ['9', '601', 9, 'In chaos theory and non-linear dynamics, what butterfly-shaped fractal strange attractor was discovered by Edward Lorenz in 1963 while modeling atmospheric convection?', ['Mandelbrot Set', 'Lorenz Attractor', 'Julia Set', 'Rössler Attractor'], 1, 'The Lorenz attractor demonstrates sensitive dependence on initial conditions (the "butterfly effect").'],
  ['9', '601', 9, 'Which French philosopher analyzed power relations, institutional discipline, and the Panopticon architectural surveillance mechanism in "Discipline and Punish"?', ['Jacques Derrida', 'Michel Foucault', 'Gilles Deleuze', 'Jean Baudrillard'], 1, 'Foucault explored how modern institutions exercise disciplinary power and biopolitics.'],
  ['9', '601', 9, 'Which social choice theory theorem proved by Kenneth Arrow in 1951 demonstrates that no ranked voting election system can satisfy all fairness criteria simultaneously?', ['Condorcet Paradox', 'Arrow\'s Impossibility Theorem', 'Gibbard-Satterthwaite Theorem', 'Median Voter Theorem'], 1, 'Arrow proved that when voters have three or more alternatives, no voting system is non-dictatorial and universally fair.'],
  ['9', '601', 9, 'Which foundational text by Ludwig Wittgenstein concluded with the famous proposition: "Whereof one cannot speak, thereof one must be silent"?', ['Philosophical Investigations', 'Tractatus Logico-Philosophicus', 'On Certainty', 'The Blue Book'], 1, 'Wittgenstein\'s Tractatus (1921) sought to delineate the strict limits of meaningful language and logic.'],

  // L10
  ['10', '601', 10, 'In the philosophy of time, which metaphysical view holds that past, present, and future events all equally exist in a four-dimensional spacetime "block universe"?', ['Presentism', 'Eternalism (Four-Dimensionalism)', 'Growing Block Theory', 'Possibilism'], 1, 'Eternalism treats time as a coordinate dimension analogous to space, supported by relativistic spacetime.'],
  ['10', '601', 10, 'In decision theory, which paradox poses a dilemma involving a super-intelligent Predictor offering two boxes, testing causal versus evidential decision theory?', ['St. Petersburg Paradox', 'Newcomb\'s Paradox', 'Monty Hall Problem', 'Prisoner\'s Dilemma'], 1, 'Newcomb\'s paradox tests whether one should take only Box B or both Box A and Box B based on predictor accuracy.'],
  ['10', '601', 10, 'In philosophy of language, which American logician proposed the "Indeterminacy of Translation" thesis in "Word and Object" using the jungle linguist example "Gavagai"?', ['W.V.O. Quine', 'Donald Davidson', 'Saul Kripke', 'Noam Chomsky'], 0, 'Quine argued that multiple incompatible translations can all fit the totality of empirical behavioral speech dispositions.'],
  ['10', '601', 10, 'Which celebrated thought experiment introduced by philosopher Hilary Putnam in 1975 showed that "meanings just ain\'t in the head" using a planet where water is replaced by XYZ?', ['Chinese Room', 'Twin Earth Thought Experiment', 'Experience Machine', 'Brain in a Vat'], 1, 'Putnam\'s Twin Earth established semantic externalism in the philosophy of mind and language.'],
  ['10', '601', 10, 'In mathematical physics, whose 1949 rotating universe solution to Einstein\'s field equations allowed for closed timelike curves, enabling theoretical time travel to the past?', ['Subrahmanyan Chandrasekhar', 'Kurt Gödel', 'Roger Penrose', 'Roy Kerr'], 1, 'Kurt Gödel discovered a cosmological solution with rotating matter permitting closed timelike worldlines.'],
];

catData.forEach(([cat, sub, lvl, q, opts, ans, note, extra = {}], i) => {
  categoryAdvancedQuestions.push(
    makeQ(
      `cat-pool-${cat}-l${lvl}-${i + 1}`,
      cat,
      sub,
      lvl,
      q,
      '1',
      opts,
      ans,
      note,
      extra
    )
  );
});

// Write to file
const outPath = path.join(__dirname, '../src/lib/levelQuestionsPool.ts');
const fileContent = `${fileHeader}
export const TRUE_FALSE_LEVEL_QUESTIONS: Question[] = ${JSON.stringify(tfQuestions, null, 2)};

export const DAILY_QUIZ_LEVEL_QUESTIONS: Question[] = ${JSON.stringify(dailyQuestions, null, 2)};

export const ADVANCED_CATEGORY_QUESTIONS: Question[] = ${JSON.stringify(categoryAdvancedQuestions, null, 2)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Successfully generated ${tfQuestions.length} True/False questions, ${dailyQuestions.length} Daily questions, and ${categoryAdvancedQuestions.length} Category questions.`);
