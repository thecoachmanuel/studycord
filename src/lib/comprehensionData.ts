import { Question } from '../types';

export interface ComprehensionPassage {
  id: string;
  level: number;
  title: string;
  subject: string;
  difficulty: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced' | 'Expert' | 'Master' | 'Scholar' | 'Grandmaster' | 'Elite Scholar';
  estimatedReadTime: string;
  wordCount: number;
  passageText: string;
  questions: Question[];
}

export const COMPREHENSION_LEVELS: ComprehensionPassage[] = [
  // =========================================================================
  // LEVEL 1: Marine Biology & Coral Reefs
  // =========================================================================
  {
    id: 'comp-lvl-1',
    level: 1,
    title: 'The Architecture & Ecology of Coral Reefs',
    subject: 'Marine Biology & Ecosystems',
    difficulty: 'Beginner',
    estimatedReadTime: '2 min read',
    wordCount: 220,
    passageText: `Coral reefs are among the most biodiverse and productive ecosystems on Earth, often described as the rainforests of the ocean. Although they cover less than one percent of the ocean floor, they provide shelter, feeding grounds, and nursery habitats for more than twenty-five percent of all known marine species.

The physical framework of a coral reef is constructed by colonies of tiny, soft-bodied organisms called coral polyps. These polyps extract dissolved calcium ions and bicarbonate from seawater, using them to secrete hard exoskeletons composed of calcium carbonate. Over centuries, countless generations of polyps deposit layers of limestone upon one another, steadily building massive underwater structures that can span thousands of kilometers.

Most reef-building corals maintain an essential mutualistic relationship with microscopic photosynthetic algae known as zooxanthellae, which live inside the coral tissues. Through photosynthesis, zooxanthellae produce glucose, amino acids, and oxygen, providing up to ninety percent of the coral polyp's metabolic energy needs. In return, the polyp offers the algae shelter and inorganic nutrients like carbon dioxide and nitrogen.

However, elevated sea surface temperatures driven by global climate change disrupt this delicate symbiosis. When heat-stressed, corals expel their zooxanthellae, losing their vibrant pigmentation in a phenomenon known as coral bleaching. Without their algal partners, bleached corals face rapid starvation unless ocean temperatures cool down quickly.`,
    questions: [
      {
        id: 'fnl-1-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '1',
        languageId: 'en',
        passage: 'The physical framework of a coral reef is constructed by colonies of tiny, soft-bodied organisms called coral polyps that secrete calcium carbonate.',
        question: 'What microscopic organisms are primarily responsible for physically constructing the reef framework?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Marine Plankton' },
          { id: 'opt2', title: 'Coral Polyps' },
          { id: 'opt3', title: 'Kelp Spores' },
          { id: 'opt4', title: 'Sea Sponges' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Coral polyps secrete calcium carbonate to construct the hard skeletal framework of reefs.',
      },
      {
        id: 'fnl-1-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '1',
        languageId: 'en',
        passage: 'These polyps extract dissolved calcium ions and bicarbonate from seawater, using them to secrete hard exoskeletons composed of calcium carbonate.',
        question: 'What chemical compound comprises the hardened exoskeleton secreted by coral polyps?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Silicon Dioxide' },
          { id: 'opt2', title: 'Calcium Carbonate' },
          { id: 'opt3', title: 'Sodium Chloride' },
          { id: 'opt4', title: 'Magnesium Sulfate' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Polyps extract calcium and bicarbonate from seawater to synthesize calcium carbonate (limestone).',
      },
      {
        id: 'fnl-1-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '1',
        languageId: 'en',
        passage: 'Corals maintain a mutualistic relationship with microscopic photosynthetic algae known as zooxanthellae, which live inside the coral tissues and supply up to 90% of energy.',
        question: 'What photosynthetic algae reside within coral tissues and supply the majority of their metabolic energy?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Spirogyra' },
          { id: 'opt2', title: 'Zooxanthellae' },
          { id: 'opt3', title: 'Cyanobacteria' },
          { id: 'opt4', title: 'Diatoms' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Zooxanthellae produce nutrients via photosynthesis that nourish their coral polyp hosts.',
      },
      {
        id: 'fnl-1-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '1',
        languageId: 'en',
        passage: 'Although they cover less than one percent of the ocean floor, they provide shelter for more than twenty-five percent of all known marine species.',
        question: 'Approximately what percentage of all known marine species depend on coral reefs for habitat?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Over 25%' },
          { id: 'opt2', title: 'Less than 5%' },
          { id: 'opt3', title: 'Around 10%' },
          { id: 'opt4', title: 'Over 75%' },
        ],
        correctAnswerOptionId: 'opt1',
        note: 'Coral reefs support more than 25% of all ocean life despite occupying less than 1% of the seafloor.',
      },
      {
        id: 'fnl-1-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '1',
        languageId: 'en',
        passage: 'When heat-stressed, corals expel their zooxanthellae, losing their vibrant pigmentation in a phenomenon known as coral bleaching.',
        question: 'What occurs during a coral bleaching event according to the passage?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Corals absorb excess toxic salt' },
          { id: 'opt2', title: 'Heat-stressed corals expel their symbiotic zooxanthellae algae' },
          { id: 'opt3', title: 'Polyps permanently migrate to deeper oceanic trenches' },
          { id: 'opt4', title: 'Limestone exoskeletons instantly dissolve into gas' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Heat stress causes corals to expel zooxanthellae, leaving them pale and at risk of starvation.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 2: Space Science & The James Webb Space Telescope
  // =========================================================================
  {
    id: 'comp-lvl-2',
    level: 2,
    title: 'The James Webb Space Telescope & Infrared Astronomy',
    subject: 'Astrophysics & Space Technology',
    difficulty: 'Elementary',
    estimatedReadTime: '2.5 min read',
    wordCount: 245,
    passageText: `Launched on December 25, 2021, aboard an Ariane 5 rocket from Kourou, French Guiana, the James Webb Space Telescope (JWST) represents the premier cosmic observatory of the twenty-first century. Built through an international collaboration between NASA, ESA, and CSA, JWST is stationed approximately 1.5 million kilometers from Earth at the second Sun-Earth Lagrange point, known as L2.

Orbiting at L2 enables JWST to maintain a fixed relative orientation where its five-layer, tennis-court-sized sunshield can continuously block the radiant thermal energy emitted by the Sun, Earth, and Moon. Keeping the observatory at cryogenic temperatures below minus 233 degrees Celsius (40 Kelvin) is imperative because infrared instruments must remain colder than the faint celestial heat signals they detect.

Unlike the Hubble Space Telescope, which observes predominantly in visible and ultraviolet spectra, JWST is engineered to prioritize infrared wavelengths. Because the cosmic expansion of spacetime stretches the light emitted by ancient galaxies into longer, redder wavelengths—a process called cosmological redshift—infrared sensors are uniquely capable of observing the very first stars and protogalaxies that formed shortly after the Big Bang, over 13.5 billion years ago.

JWST collects this ancient light using a 6.5-meter-diameter primary mirror composed of 18 hexagonal segments. These mirror segments are made of beryllium, a lightweight yet rigid metal, and electroplated with a microscopically thin coating of pure gold to maximize the reflection of infrared photons.`,
    questions: [
      {
        id: 'fnl-2-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '2',
        languageId: 'en',
        passage: 'JWST is stationed approximately 1.5 million kilometers from Earth at the second Sun-Earth Lagrange point, known as L2.',
        question: 'Where is the James Webb Space Telescope permanently stationed in space?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Low Earth Orbit (550 km altitude)' },
          { id: 'opt2', title: 'Second Sun-Earth Lagrange point (L2, 1.5 million km from Earth)' },
          { id: 'opt3', title: 'Geostationary Equatorial Orbit (35,786 km altitude)' },
          { id: 'opt4', title: 'Lunar Polar Orbit around the Moon' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'JWST operates at L2, where gravitational forces create a gravitationally balanced orbital position.',
      },
      {
        id: 'fnl-2-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '2',
        languageId: 'en',
        passage: 'Unlike the Hubble Space Telescope, which observes predominantly in visible and ultraviolet spectra, JWST is engineered to prioritize infrared wavelengths.',
        question: 'Which spectral wavelength band is JWST primarily designed to observe?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Gamma Rays' },
          { id: 'opt2', title: 'Infrared Wavelengths' },
          { id: 'opt3', title: 'Radio Waves' },
          { id: 'opt4', title: 'Hard X-Rays' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'JWST observes infrared light to detect redshifted photons from the earliest cosmic epochs.',
      },
      {
        id: 'fnl-2-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '2',
        languageId: 'en',
        passage: 'Cosmic expansion stretches the light emitted by ancient galaxies into longer, redder wavelengths—a process called cosmological redshift.',
        question: 'What physical process causes light from early galaxies to stretch into longer infrared wavelengths?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Solar Wind Deflection' },
          { id: 'opt2', title: 'Cosmological Redshift caused by cosmic expansion' },
          { id: 'opt3', title: 'Gravitational Microlensing' },
          { id: 'opt4', title: 'Atmospheric Refraction' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'As spacetime expands, photon wavelengths stretch toward the infrared end of the spectrum.',
      },
      {
        id: 'fnl-2-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '2',
        languageId: 'en',
        passage: 'JWST collects this ancient light using a 6.5-meter-diameter primary mirror composed of 18 hexagonal segments made of beryllium, electroplated with pure gold.',
        question: 'Why are the telescope primary mirror segments electroplated with pure gold?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'To conduct electrical signals across detectors' },
          { id: 'opt2', title: 'To maximize the reflection of infrared photons' },
          { id: 'opt3', title: 'To increase the mirror structural mass against micrometeorites' },
          { id: 'opt4', title: 'To prevent magnetic interference from deep space' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Gold has an exceptional reflectivity index of up to 98% in infrared wavelengths.',
      },
      {
        id: 'fnl-2-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '2',
        languageId: 'en',
        passage: 'Keeping the observatory at cryogenic temperatures below minus 233 degrees Celsius (40 Kelvin) is imperative because infrared instruments must remain colder than celestial signals.',
        question: 'Why must the telescope scientific instruments be kept at cryogenic temperatures below 40 Kelvin?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'To freeze electronic circuits into permanent superconductivity' },
          { id: 'opt2', title: 'To prevent the telescope own thermal heat from obscuring faint cosmic infrared signals' },
          { id: 'opt3', title: 'To solidify liquid fuel inside the primary thrusters' },
          { id: 'opt4', title: 'To resist outer atmospheric drag' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Any residual heat from the spacecraft would blind the ultra-sensitive infrared sensors.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 3: Neuroscience & Neuroplasticity
  // =========================================================================
  {
    id: 'comp-lvl-3',
    level: 3,
    title: 'Neuroplasticity: How the Human Brain Adapts & Learns',
    subject: 'Cognitive Neuroscience & Psychology',
    difficulty: 'Intermediate',
    estimatedReadTime: '2.5 min read',
    wordCount: 260,
    passageText: `For most of the twentieth century, conventional neuroscience operated under the dogma that the mature adult brain was anatomically static. According to this traditional view, the brain's billions of neurons formed fixed circuits during early childhood, and any neurological damage sustained thereafter was permanent and irrecoverable.

However, seminal modern research has completely overturned this assumption through the discovery of neuroplasticity—the nervous system's lifelong ability to reorganize its structural connectivity and functional mapping in response to experience, learning, sensory stimulation, or injury recovery.

Neuroplasticity operates across two distinct domains: functional plasticity and structural plasticity. Functional plasticity refers to the brain's ability to reassign specific cognitive responsibilities from a damaged neural region to healthy, undamaged areas. Structural plasticity, by contrast, describes physical alterations in anatomical architecture, where learning experiences prompt neurons to sprout new dendritic spines, synthesize synaptic connections, and prune underutilized pathways.

Furthermore, scientists confirmed that adult neurogenesis—the birth of entirely new neurons from neural stem cells—actively persists throughout adulthood. This neurogenesis is localized predominantly within the subgranular zone of the dentate gyrus inside the hippocampus, an anatomical structure indispensable for declarative memory consolidation and spatial navigation. Engaging in regular cardiovascular exercise, cognitive challenges, and intellectual exploration significantly upregulates hippocampal neurogenesis.`,
    questions: [
      {
        id: 'fnl-3-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '3',
        languageId: 'en',
        passage: 'Seminal modern research discovered neuroplasticity—the nervous system lifelong ability to reorganize its structural connectivity and functional mapping in response to experience.',
        question: 'What scientific term describes the brain ability to rewire and reorganize its neural connections across a lifetime?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Neurogenesis' },
          { id: 'opt2', title: 'Neuroplasticity' },
          { id: 'opt3', title: 'Myelination' },
          { id: 'opt4', title: 'Homeostatic Osmosis' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Neuroplasticity enables the brain to form, strengthen, or rewire neural pathways dynamically.',
      },
      {
        id: 'fnl-3-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '3',
        languageId: 'en',
        passage: 'Functional plasticity refers to the brain ability to reassign specific cognitive responsibilities from a damaged neural region to healthy, undamaged areas.',
        question: 'What is "functional plasticity" as defined in the passage?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'The permanent loss of cognitive functions following trauma' },
          { id: 'opt2', title: 'The brain ability to transfer cognitive tasks from damaged to healthy undamaged regions' },
          { id: 'opt3', title: 'The physical expansion of brain skull volume during adulthood' },
          { id: 'opt4', title: 'The chemical synthesis of myelin sheaths around motor nerves' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Functional plasticity allows adjacent or alternate brain regions to assume lost responsibilities.',
      },
      {
        id: 'fnl-3-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '3',
        languageId: 'en',
        passage: 'Adult neurogenesis is localized predominantly within the subgranular zone of the dentate gyrus inside the hippocampus, an anatomical structure indispensable for memory.',
        question: 'In which brain region does adult neurogenesis primarily occur according to the text?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Occipital Lobe' },
          { id: 'opt2', title: 'Hippocampus (Dentate Gyrus)' },
          { id: 'opt3', title: 'Cerebellum' },
          { id: 'opt4', title: 'Medulla Oblongata' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The subgranular zone of the dentate gyrus inside the hippocampus continuously produces new functional neurons.',
      },
      {
        id: 'fnl-3-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '3',
        languageId: 'en',
        passage: 'Structural plasticity describes physical alterations in anatomical architecture, where learning experiences prompt neurons to sprout new dendritic spines.',
        question: 'Which anatomical change occurs during structural plasticity as learning takes place?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Brain bones expand outward' },
          { id: 'opt2', title: 'Neurons sprout new dendritic spines and synthesize synaptic connections' },
          { id: 'opt3', title: 'All existing synapses are permanently dissolved' },
          { id: 'opt4', title: 'Blood vessels replace nervous tissue' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Structural plasticity creates visible physical changes in synapse count and dendritic spine density.',
      },
      {
        id: 'fnl-3-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '3',
        languageId: 'en',
        passage: 'Engaging in regular cardiovascular exercise, cognitive challenges, and intellectual exploration significantly upregulates hippocampal neurogenesis.',
        question: 'Which daily activities are proven to stimulate and upregulate adult neurogenesis in the hippocampus?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Cardiovascular exercise and intellectual cognitive challenges' },
          { id: 'opt2', title: 'Complete physical inactivity and sensory deprivation' },
          { id: 'opt3', title: 'Monotonous non-challenging repetitive routines' },
          { id: 'opt4', title: 'Excessive sugar consumption without physical activity' },
        ],
        correctAnswerOptionId: 'opt1',
        note: 'Aerobic exercise and intellectual novelty release growth factors that boost neuron generation.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 4: World History & The Ancient Silk Road
  // =========================================================================
  {
    id: 'comp-lvl-4',
    level: 4,
    title: 'The Architecture & Geopolitics of the Ancient Silk Road',
    subject: 'World History & Civilizations',
    difficulty: 'Upper Intermediate',
    estimatedReadTime: '2.5 min read',
    wordCount: 275,
    passageText: `The Silk Road was not a solitary paved highway, but rather an intricate, shifting geopolitical network of overland and maritime trade routes connecting East Asia to the Mediterranean basin. Formalized during China's Han Dynasty around 130 BCE following the diplomatic expeditions of imperial envoy Zhang Qian, the overland corridors traversed more than 6,400 kilometers of rugged topography, spanning the Taklamakan Desert, the Pamir Mountains, the Iranian Plateau, and the Levant.

While luxury commodities such as Chinese silk, porcelain, Persian lapis lazuli, Roman glassware, and Indian spices commanded astronomical prices along the caravans, the most profound legacy of the Silk Road lay in the intangible diffusion of knowledge, technologies, and religious beliefs. Caravanserai—roadside inns positioned roughly one day's journey apart—served as crucial commercial and cultural hubs where multi-lingual merchants, scholars, and pilgrims exchanged ideas alongside goods.

The transmission of papermaking technology westward illustrates this profound civilizational impact. Captured Chinese artisans following the Battle of Talas in 751 CE introduced papermaking to Samarkand, whence it diffused through the Islamic Golden Age in Baghdad and eventually revolutionized European intellectual life.

Similarly, the Silk Road facilitated the geographic expansion of major world religions. Buddhism journeyed from northern India across the Gandharan kingdom into Central Asia and China, leading to the creation of monumental cultural treasures like the Mogao Caves at Dunhuang.`,
    questions: [
      {
        id: 'fnl-4-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '4',
        languageId: 'en',
        passage: 'Formalized during China Han Dynasty around 130 BCE following the diplomatic expeditions of imperial envoy Zhang Qian.',
        question: 'During which Chinese imperial dynasty were the overland Silk Road routes officially formalized?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Tang Dynasty' },
          { id: 'opt2', title: 'Han Dynasty' },
          { id: 'opt3', title: 'Ming Dynasty' },
          { id: 'opt4', title: 'Song Dynasty' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The Han Dynasty opened official trade contacts westward after Zhang Qian diplomatic missions.',
      },
      {
        id: 'fnl-4-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '4',
        languageId: 'en',
        passage: 'Caravanserai—roadside inns positioned roughly one day journey apart—served as crucial commercial and cultural hubs where multi-lingual merchants exchanged ideas.',
        question: 'What were caravanserai along the Silk Road?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Military naval warships patrolling river borders' },
          { id: 'opt2', title: 'Roadside inns spaced one day travel apart for merchants and camel caravans' },
          { id: 'opt3', title: 'Religious monastic temples dedicated to desert deities' },
          { id: 'opt4', title: 'Toll booths collecting imperial silver taxes' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Caravanserai provided vital safety, water, lodging, and cultural exchange for desert travelers.',
      },
      {
        id: 'fnl-4-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '4',
        languageId: 'en',
        passage: 'Captured Chinese artisans following the Battle of Talas in 751 CE introduced papermaking to Samarkand, whence it diffused into Baghdad.',
        question: 'Following which historical battle was Chinese papermaking technology transferred to the Islamic world?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Battle of Marathon' },
          { id: 'opt2', title: 'Battle of Talas (751 CE)' },
          { id: 'opt3', title: 'Battle of Red Cliffs' },
          { id: 'opt4', title: 'Battle of Yarmouk' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The Battle of Talas between Abbasid and Tang forces led to the spread of papermaking into Samarkand.',
      },
      {
        id: 'fnl-4-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '4',
        languageId: 'en',
        passage: 'Buddhism journeyed from northern India across the Gandharan kingdom into Central Asia and China, leading to the Mogao Caves.',
        question: 'Which major religion spread eastward along the Silk Road from India into Central Asia and China?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Zoroastrianism' },
          { id: 'opt2', title: 'Buddhism' },
          { id: 'opt3', title: 'Shintoism' },
          { id: 'opt4', title: 'Jainism' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Buddhist monks and merchants carried scriptures and art east along Silk Road trade corridors.',
      },
      {
        id: 'fnl-4-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '4',
        languageId: 'en',
        passage: 'The overland corridors traversed more than 6,400 kilometers of rugged topography, spanning the Taklamakan Desert and Pamir Mountains.',
        question: 'Approximately how long was the expansive overland network of the Silk Road?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Around 1,500 kilometers' },
          { id: 'opt2', title: 'More than 6,400 kilometers' },
          { id: 'opt3', title: 'Exactly 25,000 kilometers' },
          { id: 'opt4', title: 'Under 800 kilometers' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The network stretched across 6,400+ kilometers (4,000 miles) of Eurasian terrain.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 5: Quantum Mechanics & Entanglement
  // =========================================================================
  {
    id: 'comp-lvl-5',
    level: 5,
    title: 'The Strange Realm of Quantum Superposition & Entanglement',
    subject: 'Quantum Physics & Foundations',
    difficulty: 'Advanced',
    estimatedReadTime: '3 min read',
    wordCount: 290,
    passageText: `At the subatomic scale, physical reality ceases to behave in accordance with classical Newtonian mechanics. Instead, matter and light exhibit wave-particle duality, governed by the probabilistic mathematics of quantum mechanics.

A fundamental pillar of quantum theory is the principle of superposition, which posits that an unobserved quantum system exists simultaneously in a linear combination of all possible states. A particle does not possess a definite physical attribute—such as spatial position, momentum, or spin—until a measurement is performed. The act of observation forces the system's wavefunction to "collapse" into a single, concrete eigenstate, as demonstrated by the famous Schrödinger's cat thought experiment.

Even more counter-intuitive is the phenomenon of quantum entanglement. When two or more particles become entangled through physical interaction, their quantum states become inextricably linked, regardless of the spatial distance separating them. Measuring the state of one entangled particle instantly determines the corresponding state of its entangled partner, even if they are positioned at opposite ends of the observable universe.

Albert Einstein famously resisted this implication, dismissing it as "spooky action at a distance" (spukhafte Fernwirkung) and arguing in the 1935 EPR paper that quantum mechanics was incomplete and must harbor hidden local variables.

However, in 1964, Northern Irish physicist John Stewart Bell formulated Bell's Theorem, establishing mathematical inequalities that any local hidden-variable theory must satisfy. Subsequent landmark experiments conducted by Alain Aspect in 1982—and recognized with the 2022 Nobel Prize in Physics—conclusively proved that Bell's inequalities are violated by quantum mechanics, confirming that the universe is fundamentally non-local.`,
    questions: [
      {
        id: 'fnl-5-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '5',
        languageId: 'en',
        passage: 'Superposition posits that an unobserved quantum system exists simultaneously in a linear combination of all possible states until a measurement collapses the wavefunction.',
        question: 'What is the quantum principle of superposition?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Particles travel faster than light when unobserved' },
          { id: 'opt2', title: 'A quantum system exists simultaneously in multiple possible states until measured' },
          { id: 'opt3', title: 'Every atomic nucleus contains equal numbers of protons and electrons' },
          { id: 'opt4', title: 'Matter is converted entirely into pure thermodynamic energy upon contact' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Superposition means quantum states coexist probabilistically until observation precipitates wavefunction collapse.',
      },
      {
        id: 'fnl-5-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '5',
        languageId: 'en',
        passage: 'Albert Einstein famously resisted this implication, dismissing it as "spooky action at a distance" in the 1935 EPR paper.',
        question: 'What phrase did Albert Einstein famously coin to express skepticism of quantum entanglement?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Invisible clockwork mechanics' },
          { id: 'opt2', title: 'Spooky action at a distance' },
          { id: 'opt3', title: 'The cosmic gravitational illusion' },
          { id: 'opt4', title: 'Subatomic chaotic turbulence' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Einstein used the phrase "spukhafte Fernwirkung" (spooky action at a distance) to critique instantaneous correlation.',
      },
      {
        id: 'fnl-5-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '5',
        languageId: 'en',
        passage: 'In 1964, John Stewart Bell formulated Bell Theorem, establishing mathematical inequalities that any local hidden-variable theory must satisfy.',
        question: 'What mathematical framework proved that local hidden-variable theories cannot explain quantum entanglement?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Fermi Paradox' },
          { id: 'opt2', title: 'Bell Theorem and Inequalities' },
          { id: 'opt3', title: 'Kepler Third Law' },
          { id: 'opt4', title: 'Lorentz Contraction' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Bell theorem provided experimental criteria to test whether local realism holds true.',
      },
      {
        id: 'fnl-5-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '5',
        languageId: 'en',
        passage: 'Subsequent landmark experiments by Alain Aspect conclusively proved that Bell inequalities are violated, confirming non-locality.',
        question: 'What did Alain Aspect landmark experiments prove regarding the physical universe?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'That gravity is strictly an electromagnetic force' },
          { id: 'opt2', title: 'That the universe is fundamentally non-local and Bell inequalities are violated' },
          { id: 'opt3', title: 'That electrons do not possess intrinsic magnetic moment' },
          { id: 'opt4', title: 'That light cannot be polarized in a vacuum' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Aspect confirmed the violation of Bell inequalities, cementing non-locality as an intrinsic property of nature.',
      },
      {
        id: 'fnl-5-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '5',
        languageId: 'en',
        passage: 'Measuring the state of one entangled particle instantly determines the corresponding state of its partner regardless of spatial distance.',
        question: 'What occurs when a measurement is performed on one member of an entangled particle pair?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'The other particle is instantaneously annihilated' },
          { id: 'opt2', title: 'The state of the entangled partner is instantaneously determined regardless of distance' },
          { id: 'opt3', title: 'Both particles lose all mass and convert into electromagnetic heat' },
          { id: 'opt4', title: 'The measurement must wait for light to travel between both particles' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Entanglement implies instantaneous correlation between measurement outcomes across arbitrary distances.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 6: Artificial Intelligence & Machine Learning
  // =========================================================================
  {
    id: 'comp-lvl-6',
    level: 6,
    title: 'The Evolution of Artificial Intelligence: From Perceptrons to Transformers',
    subject: 'Computer Science & AI',
    difficulty: 'Expert',
    estimatedReadTime: '3 min read',
    wordCount: 300,
    passageText: `The quest to construct artificial intelligence originated in the mid-twentieth century, catalyzed by Alan Turing's pioneering question: "Can machines think?" In 1957, Frank Rosenblatt implemented the perceptron, an early algorithmic model of an organic biological neuron capable of binary classification. However, early connectionist optimism collapsed after Marvin Minsky and Seymour Papert demonstrated in 1969 that single-layer perceptrons were mathematically incapable of solving linearly inseparable problems, such as the exclusive-OR (XOR) logical function, ushering in the first "AI Winter."

The renaissance of neural computing arrived through the rediscovery and popularization of backpropagation in the 1980s by Geoffrey Hinton, David Rumelhart, and Ronald Williams. Backpropagation enabled multi-layer deep neural networks to calculate gradients using the chain rule of calculus, systematically adjusting inter-neuron connection weights to minimize loss functions.

By the 2010s, explosive surges in digital data combined with the parallel processing architectures of Graphics Processing Units (GPUs) unleashed deep learning. Convolutional Neural Networks (CNNs) revolutionized computer vision, while Recurrent Neural Networks (RNNs) analyzed sequential language data.

The watershed breakthrough occurred in 2017 with the publication of the Google Brain paper "Attention Is All You Need," which introduced the Transformer architecture. Transformers discarded recurrent sequential bottlenecks in favor of self-attention mechanisms. Self-attention calculates mathematical affinity scores between all tokens in a passage simultaneously, capturing long-range contextual relationships and facilitating massive parallel training that powers modern Large Language Models.`,
    questions: [
      {
        id: 'fnl-6-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '6',
        languageId: 'en',
        passage: 'In 1969, Minsky and Papert demonstrated that single-layer perceptrons were mathematically incapable of solving linearly inseparable problems like XOR.',
        question: 'Which simple logical function proved impossible for single-layer perceptrons to resolve, contributing to the first AI Winter?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'AND function' },
          { id: 'opt2', title: 'Exclusive-OR (XOR) function' },
          { id: 'opt3', title: 'OR function' },
          { id: 'opt4', title: 'NOT function' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Single-layer perceptrons cannot draw non-linear decision boundaries required to separate XOR outputs.',
      },
      {
        id: 'fnl-6-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '6',
        languageId: 'en',
        passage: 'Backpropagation enabled multi-layer deep neural networks to calculate gradients using the chain rule of calculus, adjusting connection weights.',
        question: 'What mathematical rule underpins backpropagation to compute gradients and optimize neural network weights?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Pythagorean Theorem' },
          { id: 'opt2', title: 'Chain rule of calculus' },
          { id: 'opt3', title: 'Binomial Expansion' },
          { id: 'opt4', title: 'L-Hopital Rule' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The chain rule computes partial derivatives of the loss with respect to each weight layer by layer.',
      },
      {
        id: 'fnl-6-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '6',
        languageId: 'en',
        passage: 'In 2017, the seminal paper "Attention Is All You Need" introduced the Transformer architecture.',
        question: 'What landmark neural network architecture was introduced in the 2017 paper "Attention Is All You Need"?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Support Vector Machine' },
          { id: 'opt2', title: 'Transformer' },
          { id: 'opt3', title: 'Markov Decision Process' },
          { id: 'opt4', title: 'Hopfield Network' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The Transformer architecture revolutionized natural language processing and multimodal AI.',
      },
      {
        id: 'fnl-6-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '6',
        languageId: 'en',
        passage: 'Self-attention calculates mathematical affinity scores between all tokens in a passage simultaneously, capturing long-range contextual relationships.',
        question: 'What is the primary operational advantage of self-attention in Transformers over older recurrent models?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'It processes text one single word at a time strictly in chronological order' },
          { id: 'opt2', title: 'It evaluates pairwise relationships between all tokens concurrently with full parallelism' },
          { id: 'opt3', title: 'It permanently deletes all grammatical rules' },
          { id: 'opt4', title: 'It relies solely on analog magnetic tape' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Self-attention enables parallel computation and tracks relationships between words regardless of their separation.',
      },
      {
        id: 'fnl-6-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '6',
        languageId: 'en',
        passage: 'Explosive surges in digital data combined with the parallel processing architectures of Graphics Processing Units (GPUs) unleashed deep learning.',
        question: 'Which computer hardware architecture fueled the deep learning revolution by enabling massive parallel matrix operations?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Magnetic Tape Storage' },
          { id: 'opt2', title: 'Graphics Processing Units (GPUs)' },
          { id: 'opt3', title: 'Single-core Vacuum Tube Processors' },
          { id: 'opt4', title: 'Mechanical Relay Calculators' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'GPUs excel at running thousands of mathematical tensor and matrix calculations simultaneously.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 7: Oceanography & Extremophiles
  // =========================================================================
  {
    id: 'comp-lvl-7',
    level: 7,
    title: 'Extremophiles & Abyssal Hydrothermal Vents',
    subject: 'Oceanography & Astrobiology',
    difficulty: 'Master',
    estimatedReadTime: '3 min read',
    wordCount: 295,
    passageText: `In 1977, oceanographers aboard the research submersible Alvin explored the Galapagos Rift along the eastern Pacific floor, more than 2,500 meters beneath the surface. Expecting to find an oceanic desert devoid of significant biology due to perpetual darkness, crushing hydrostatic pressure, and near-freezing temperatures, the scientists were stunned to encounter flourishing, dense communities of giant tube worms, white crabs, and clams.

This discovery overturned the long-held biological axiom that all complex life on Earth depends ultimately on solar photosynthesis. Instead, abyssal vent ecosystems thrive on chemosynthesis, driven by geochemical energy discharged from hydrothermal vents known as "black smokers."

Black smokers form along divergent tectonic plate boundaries where seawater percolates into fractures in the oceanic crust, becomes superheated by magma chambers to temperatures exceeding 400 degrees Celsius without boiling due to immense pressure, and dissolves minerals like iron, zinc, and copper sulfides. When this mineral-rich acidic effluent erupts into the cold 2-degree ocean, metal sulfides precipitate out, constructing chimney towers.

The primary producers of these ecosystems are chemolithoautotrophic bacteria. These extremophile microbes oxidize toxic hydrogen sulfide to synthesize organic sugars from carbon dioxide. Giant tube worms (Riftia pachyptila), which lack a mouth, digestive tract, or gut, harbor billions of these symbiotic bacteria inside an organ called a trophosome.

The existence of thriving chemosynthetic biospheres in subterranean abyssal oceans provides compelling analogs for astrobiologists investigating life in the sub-surface ice-covered oceans of Jovian moon Europa and Saturnian moon Enceladus.`,
    questions: [
      {
        id: 'fnl-7-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '7',
        languageId: 'en',
        passage: 'Abyssal vent ecosystems thrive on chemosynthesis, driven by geochemical energy discharged from hydrothermal vents.',
        question: 'What metabolic process forms the energetic basis of life around deep-sea hydrothermal vents in total darkness?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Photosynthesis' },
          { id: 'opt2', title: 'Chemosynthesis' },
          { id: 'opt3', title: 'Nuclear Fission' },
          { id: 'opt4', title: 'Thermodynamic Radiolysis' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Chemosynthesis uses chemical energy from inorganic sulfide oxidation rather than sunlight to synthesize organic molecules.',
      },
      {
        id: 'fnl-7-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '7',
        languageId: 'en',
        passage: 'Giant tube worms (Riftia pachyptila), which lack a mouth or digestive tract, harbor symbiotic bacteria inside a trophosome.',
        question: 'How do giant tube worms (Riftia pachyptila) obtain nutrition without a digestive system or mouth?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'By absorbing floating seaweed fragments through their skin' },
          { id: 'opt2', title: 'Through symbiotic bacteria housed in a specialized organ called a trophosome' },
          { id: 'opt3', title: 'By swallowing hot mineral water directly into their gills' },
          { id: 'opt4', title: 'By photosynthesizing bioluminescent light' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Endosymbiotic chemotrophic bacteria in the trophosome supply 100% of the worm organic nutrients.',
      },
      {
        id: 'fnl-7-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '7',
        languageId: 'en',
        passage: 'These extremophile microbes oxidize toxic hydrogen sulfide to synthesize organic sugars from dissolved carbon dioxide.',
        question: 'What toxic chemical compound do hydrothermal vent bacteria oxidize to generate metabolic energy?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Sodium Chloride' },
          { id: 'opt2', title: 'Hydrogen Sulfide' },
          { id: 'opt3', title: 'Potassium Nitrate' },
          { id: 'opt4', title: 'Calcium Carbonate' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Chemolithoautotrophs extract chemical energy by oxidizing dissolved hydrogen sulfide (H2S).',
      },
      {
        id: 'fnl-7-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '7',
        languageId: 'en',
        passage: 'In 1977, oceanographers aboard the research submersible Alvin explored the Galapagos Rift along the eastern Pacific floor.',
        question: 'Which famous deep-sea research submersible was used to discover hydrothermal vent ecosystems in 1977?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Nautilus' },
          { id: 'opt2', title: 'Alvin' },
          { id: 'opt3', title: 'Trieste' },
          { id: 'opt4', title: 'Mir-1' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'DSV Alvin was the deep-submergence vehicle that carried out the historic 1977 Galapagos expedition.',
      },
      {
        id: 'fnl-7-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '7',
        languageId: 'en',
        passage: 'Subterranean abyssal oceans provide compelling analogs for astrobiologists investigating life on moons Europa and Enceladus.',
        question: 'Why are hydrothermal vent biospheres significant to modern planetary astrobiology?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'They prove that life can exist only on planetary surfaces with atmospheres' },
          { id: 'opt2', title: 'They demonstrate that life can flourish without sunlight in sub-surface ice-covered oceans like Europa and Enceladus' },
          { id: 'opt3', title: 'They show that Mars must be completely hollow' },
          { id: 'opt4', title: 'They confirm that solar flares create living cells' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Vents prove that geothermal heating and chemosynthesis can support rich ecosystems in dark planetary oceans.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 8: Macroeconomics & Energy Transition
  // =========================================================================
  {
    id: 'comp-lvl-8',
    level: 8,
    title: 'The Macroeconomics of the Global Energy Transition',
    subject: 'Economics & Energy Policy',
    difficulty: 'Scholar',
    estimatedReadTime: '3 min read',
    wordCount: 310,
    passageText: `The ongoing decarbonization of the global economy marks the most comprehensive industrial realignment since the onset of the Industrial Revolution. Driven by climate imperatives outlined in the 2015 Paris Agreement and steep declines in renewable generation costs, energy markets are undergoing a fundamental structural transition from fuel-based systems to capital-intensive technology systems.

A central metric governing this economic transformation is the Levelized Cost of Electricity (LCOE), which measures the net present cost of electricity generation over a plant's operational lifetime per megawatt-hour. Between 2010 and 2023, the global benchmark LCOE for utility-scale solar photovoltaics plummeted by over eighty-five percent, while onshore wind costs dropped by nearly seventy percent. Consequently, solar and wind have achieved grid parity in most global jurisdictions, making them cheaper than newly constructed coal or natural gas facilities.

However, the rapid scaling of renewable generation exposes the core vulnerability of variable energy resources: meteorological intermittency. Unlike thermal power plants, which provide continuous dispatchable baseload power, solar arrays generate electricity only during daylight hours, and wind turbines fluctuate with atmospheric pressure systems.

This intermittency gives rise to phenomena such as the "Duck Curve," characterized by steep midday solar supply gluts followed by sharp evening demand spikes as solar output fades just as residential consumption surges. Addressing this challenge requires massive capital investments in grid flexibility: grid-scale lithium iron phosphate (LFP) battery storage, pumped hydroelectric storage, dynamic demand-response mechanisms, and ultra-high-voltage direct-current (UHVDC) transmission lines capable of wheeling clean power across continental distances.`,
    questions: [
      {
        id: 'fnl-8-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '8',
        languageId: 'en',
        passage: 'Levelized Cost of Electricity (LCOE) measures the net present cost of electricity generation over a plant operational lifetime per megawatt-hour.',
        question: 'What does the economic metric "Levelized Cost of Electricity" (LCOE) quantify?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'The carbon tax penalty levied against industrial manufacturers' },
          { id: 'opt2', title: 'The net present lifetime cost of generating electricity per unit of energy (MWh)' },
          { id: 'opt3', title: 'The annual profit margin of municipal utility providers' },
          { id: 'opt4', title: 'The price of uranium fuel on international commodity exchanges' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'LCOE assesses all capital, fuel, maintenance, and operational expenses divided by lifetime energy generated.',
      },
      {
        id: 'fnl-8-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '8',
        languageId: 'en',
        passage: 'Between 2010 and 2023, the global benchmark LCOE for utility-scale solar photovoltaics plummeted by over eighty-five percent.',
        question: 'By approximately how much did the global benchmark LCOE for solar photovoltaics decline between 2010 and 2023?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Less than 10%' },
          { id: 'opt2', title: 'Over 85%' },
          { id: 'opt3', title: 'Around 25%' },
          { id: 'opt4', title: 'It remained completely flat' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Technological learning curves, manufacturing scale, and improved efficiencies reduced solar LCOE by over 85%.',
      },
      {
        id: 'fnl-8-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '8',
        languageId: 'en',
        passage: 'This intermittency gives rise to phenomena such as the "Duck Curve," characterized by steep midday solar supply gluts followed by sharp evening demand spikes.',
        question: 'What is the "Duck Curve" in power grid management?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Migratory waterbird patterns disrupting offshore wind turbines' },
          { id: 'opt2', title: 'A graph showing steep midday solar surplus followed by a sharp evening net load ramp' },
          { id: 'opt3', title: 'A formula calculating thermal cooling efficiency in nuclear reactors' },
          { id: 'opt4', title: 'The seasonal price fluctuations of imported liquefied natural gas' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The Duck Curve illustrates net load on the electrical grid when high solar midday production is followed by sunset demand peaks.',
      },
      {
        id: 'fnl-8-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '8',
        languageId: 'en',
        passage: 'The rapid scaling of renewable generation exposes the core vulnerability of variable resources: meteorological intermittency.',
        question: 'What is the primary technological challenge associated with large-scale solar and wind deployment?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Excessive fuel transport shipping costs' },
          { id: 'opt2', title: 'Intermittent generation tied to weather and sunlight conditions' },
          { id: 'opt3', title: 'Radioactive byproduct contamination' },
          { id: 'opt4', title: 'Extreme operational water consumption' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Renewables cannot produce dispatchable power on command unless backed by energy storage or flexible capacity.',
      },
      {
        id: 'fnl-8-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '8',
        languageId: 'en',
        passage: 'Ultra-high-voltage direct-current (UHVDC) transmission lines are capable of wheeling clean power across continental distances.',
        question: 'Which grid infrastructure technology allows massive electrical power transmission across continental distances with minimal line loss?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Low-voltage copper wiring' },
          { id: 'opt2', title: 'Ultra-High-Voltage Direct-Current (UHVDC) transmission lines' },
          { id: 'opt3', title: 'Overhead telephone cables' },
          { id: 'opt4', title: 'Submerged iron water pipelines' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'UHVDC systems drastically reduce capacitive and resistive losses across thousand-kilometer transmission routes.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 9: Molecular Biology & CRISPR-Cas9
  // =========================================================================
  {
    id: 'comp-lvl-9',
    level: 9,
    title: 'CRISPR-Cas9 & The Frontiers of Gene Editing',
    subject: 'Molecular Genetics & Biotechnology',
    difficulty: 'Grandmaster',
    estimatedReadTime: '3.5 min read',
    wordCount: 325,
    passageText: `In 2012, biochemists Jennifer Doudna and Emmanuelle Charpentier published a revolutionary study demonstrating that a bacterial defense mechanism could be harnessed as a programmable, precision molecular scissors for editing the genomes of living organisms, work that was subsequently awarded the 2020 Nobel Prize in Chemistry.

CRISPR, an acronym for Clustered Regularly Interspaced Short Palindromic Repeats, was originally evolved by bacteria and archaea as an adaptive immune system against bacteriophage viruses. Upon surviving a viral attack, bacteria integrate short fragments of the viral DNA into their own chromosomal CRISPR locus, creating a genetic immunological memory bank.

When the bacterium encounters the same phage again, the CRISPR sequence is transcribed into single-guide RNA (sgRNA). This guide RNA associates with a Cas (CRISPR-associated) endonuclease enzyme, most commonly Cas9 derived from Streptococcus pyogenes.

The sgRNA acts as a targeted molecular homing device, scanning genomic DNA until it finds a complementary 20-nucleotide sequence situated immediately adjacent to a short, conserved DNA sequence known as a Protospacer Adjacent Motif (PAM)—typically 5'-NGG-3' for SpCas9. Upon target binding, the Cas9 enzyme uses its two catalytic nuclease domains, RuvC and HNH, to cleave both strands of the DNA double helix, introducing a precise double-strand break (DSB).

The cell's innate DNA repair mechanisms then attempt to repair the break. Through Non-Homologous End Joining (NHEJ), an error-prone pathway, small insertions or deletions (indels) are introduced, disabling targeted pathogenic genes. Alternatively, by providing an exogenous synthetic donor DNA template, Homology-Directed Repair (HDR) can introduce precise genetic corrections, opening unprecedented therapeutic horizons for monogenic disorders like sickle cell disease and cystic fibrosis.`,
    questions: [
      {
        id: 'fnl-9-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '9',
        languageId: 'en',
        passage: 'CRISPR was originally evolved by bacteria and archaea as an adaptive immune system against bacteriophage viruses.',
        question: 'What was the natural biological function of CRISPR in bacteria prior to its biotechnology adaptation?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Cellular locomotion and flagella propulsion' },
          { id: 'opt2', title: 'An adaptive bacterial immune system defending against viral bacteriophages' },
          { id: 'opt3', title: 'Cellular glucose metabolism and fermentation' },
          { id: 'opt4', title: 'Synthesizing protective antibiotic biofilms' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Bacteria record viral DNA fragments to identify and destroy future bacteriophage invaders.',
      },
      {
        id: 'fnl-9-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '9',
        languageId: 'en',
        passage: 'The guide RNA associates with a Cas endonuclease enzyme, most commonly Cas9 derived from Streptococcus pyogenes.',
        question: 'What is the biochemical function of the Cas9 protein in the CRISPR complex?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'A polymerase that replicates RNA into DNA' },
          { id: 'opt2', title: 'An endonuclease enzyme that cleaves both strands of the target DNA double helix' },
          { id: 'opt3', title: 'A structural lipid forming the nuclear envelope' },
          { id: 'opt4', title: 'A hormone that triggers cellular mitosis' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Cas9 acts as the molecular scalpel, executing targeted double-stranded DNA cleavage.',
      },
      {
        id: 'fnl-9-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '9',
        languageId: 'en',
        passage: 'The sgRNA acts as a targeted homing device until it finds a complementary sequence situated adjacent to a Protospacer Adjacent Motif (PAM).',
        question: 'What essential DNA landmark must be located adjacent to the target genomic sequence for Cas9 binding and cleavage?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'TATA Box Promoter' },
          { id: 'opt2', title: 'Protospacer Adjacent Motif (PAM)' },
          { id: 'opt3', title: 'Telomeric Repeat' },
          { id: 'opt4', title: 'Kozak Sequence' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Without the PAM sequence (typically 5-NGG-3 for SpCas9), the enzyme cannot bind or cut DNA.',
      },
      {
        id: 'fnl-9-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '9',
        languageId: 'en',
        passage: 'By providing an exogenous synthetic donor template, Homology-Directed Repair (HDR) can introduce precise genetic corrections.',
        question: 'Which DNA repair pathway allows researchers to insert precise genetic corrections using a donor template?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Apoptosis' },
          { id: 'opt2', title: 'Homology-Directed Repair (HDR)' },
          { id: 'opt3', title: 'Non-Homologous End Joining (NHEJ)' },
          { id: 'opt4', title: 'Nucleotide Excision Repair' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'HDR uses a homologous donor template to repair double-strand breaks with exact base substitutions.',
      },
      {
        id: 'fnl-9-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '9',
        languageId: 'en',
        passage: 'In 2020, Jennifer Doudna and Emmanuelle Charpentier were awarded the Nobel Prize in Chemistry for their groundbreaking CRISPR research.',
        question: 'Which scientists shared the 2020 Nobel Prize in Chemistry for developing the CRISPR-Cas9 genome editing method?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'James Watson and Francis Crick' },
          { id: 'opt2', title: 'Jennifer Doudna and Emmanuelle Charpentier' },
          { id: 'opt3', title: 'Rosalind Franklin and Barbara McClintock' },
          { id: 'opt4', title: 'Craig Venter and Francis Collins' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Doudna and Charpentier were jointly awarded the 2020 Nobel Prize for this historic biotechnology breakthrough.',
      },
    ],
  },

  // =========================================================================
  // LEVEL 10: Philosophy of Mind & Cognitive Science
  // =========================================================================
  {
    id: 'comp-lvl-10',
    level: 10,
    title: 'The Philosophy of Mind & The Hard Problem of Consciousness',
    subject: 'Epistemology & Cognitive Philosophy',
    difficulty: 'Elite Scholar',
    estimatedReadTime: '3.5 min read',
    wordCount: 340,
    passageText: `In the philosophy of mind and contemporary cognitive science, few puzzles are as profound or persistent as the nature of subjective conscious experience. In 1995, Australian philosopher David Chalmers articulated a decisive distinction between what he termed the "Easy Problems" and the "Hard Problem" of consciousness.

The so-called "Easy Problems" are those susceptible to standard empirical methods in neurobiology and computational cognitive science. They include explaining how the brain discriminates sensory stimuli, integrates information across sensory modalities, regulates sleep-wake cycles, and controls motor behavior. While technologically formidable, these problems require understanding only cognitive functions and physical mechanisms: the neurochemical wiring and electrophysiological firing patterns of the central nervous system.

By contrast, the "Hard Problem" asks why and how any physical processing in the brain is accompanied by subjective, qualitative inner experience at all. Why should the electro-chemical firing of neurons in the visual cortex give rise to the subjective feeling of redness ("qualia"), or the physical acoustic pressure waves vibrating the tympanic membrane feel like the poignant sorrow of a minor chord?

Physicalists argue that consciousness is an emergent property of sufficiently complex biological information processing, anticipating that as neuroimaging and connectomics advance, the explanatory gap will naturally close.

Critics of strict physicalism, however, invoke thought experiments such as Frank Jackson's "Mary the Color Scientist" and Chalmers' "Philosophical Zombies"—hypothetical beings physically and functionally identical to humans in every microphysical respect, yet devoid of any inner conscious experience whatsoever. These arguments suggest that subjective experience may represent an irreducible fundamental feature of the cosmos, much like mass, space-time, or electric charge, motivating growing philosophical inquiry into dual-aspect monism and panpsychism.`,
    questions: [
      {
        id: 'fnl-10-1',
        category: 'funAndLearn',
        subcategory: '701',
        level: '10',
        languageId: 'en',
        passage: 'In 1995, Australian philosopher David Chalmers articulated a decisive distinction between the "Easy Problems" and the "Hard Problem" of consciousness.',
        question: 'Which contemporary philosopher famously formulated "The Hard Problem of Consciousness" in 1995?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Daniel Dennett' },
          { id: 'opt2', title: 'David Chalmers' },
          { id: 'opt3', title: 'Thomas Nagel' },
          { id: 'opt4', title: 'John Searle' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'David Chalmers formalized the Hard Problem, distinguishing mechanism from phenomenal experience.',
      },
      {
        id: 'fnl-10-2',
        category: 'funAndLearn',
        subcategory: '701',
        level: '10',
        languageId: 'en',
        passage: 'The Hard Problem asks why and how physical processing in the brain is accompanied by subjective, qualitative inner experience at all.',
        question: 'What is the essence of "The Hard Problem of Consciousness"?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Measuring the electrical voltage of nerve action potentials' },
          { id: 'opt2', title: 'Explaining why and how physical neural computations generate subjective phenomenal experiences (qualia)' },
          { id: 'opt3', title: 'Mapping the motor commands sent to finger muscles' },
          { id: 'opt4', title: 'Calculating the mathematical speed of chemical neurotransmitter diffusion' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'The Hard Problem tackles the explanatory gap between objective neural matter and subjective conscious feeling.',
      },
      {
        id: 'fnl-10-3',
        category: 'funAndLearn',
        subcategory: '701',
        level: '10',
        languageId: 'en',
        passage: 'Why should the firing of neurons in the visual cortex give rise to the subjective feeling of redness ("qualia")?',
        question: 'In philosophy of mind, what term denotes individual instances of subjective, conscious experience (such as the redness of a rose)?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Epistemes' },
          { id: 'opt2', title: 'Qualia' },
          { id: 'opt3', title: 'Algorithms' },
          { id: 'opt4', title: 'Synapses' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Qualia refers to the subjective, qualitative "what it is like" aspect of conscious mental states.',
      },
      {
        id: 'fnl-10-4',
        category: 'funAndLearn',
        subcategory: '701',
        level: '10',
        languageId: 'en',
        passage: 'Chalmers posits "Philosophical Zombies"—hypothetical beings physically and functionally identical to humans yet devoid of inner conscious experience.',
        question: 'What is a "Philosophical Zombie" in the context of Chalmers thought experiment?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'An infected biological creature reanimated from death' },
          { id: 'opt2', title: 'A hypothetical entity physically identical to a human in every detail, but completely lacking conscious experience' },
          { id: 'opt3', title: 'A robotic machine that cannot process visual inputs' },
          { id: 'opt4', title: 'A person operating under total hypnotic trance' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Philosophical zombies act identically to conscious humans from the outside, but have no inner subjective world.',
      },
      {
        id: 'fnl-10-5',
        category: 'funAndLearn',
        subcategory: '701',
        level: '10',
        languageId: 'en',
        passage: 'These arguments suggest that subjective experience may represent an irreducible fundamental feature of the cosmos, motivating panpsychism.',
        question: 'Which philosophical view proposes that consciousness may be a fundamental, ubiquitous feature of the physical cosmos?',
        questionType: '1',
        options: [
          { id: 'opt1', title: 'Logical Positivism' },
          { id: 'opt2', title: 'Panpsychism' },
          { id: 'opt3', title: 'Behaviorism' },
          { id: 'opt4', title: 'Eliminative Materialism' },
        ],
        correctAnswerOptionId: 'opt2',
        note: 'Panpsychism suggests consciousness is a basic constituent of reality rather than merely an emergent biological byproduct.',
      },
    ],
  },
];

export function getComprehensionByLevel(level: number | string): ComprehensionPassage {
  const num = Math.max(1, Math.min(10, parseInt(String(level), 10) || 1));
  const found = COMPREHENSION_LEVELS.find((p) => p.level === num);
  return found || COMPREHENSION_LEVELS[0];
}

export function getAllComprehensionQuestions(): Question[] {
  return COMPREHENSION_LEVELS.flatMap((p) => p.questions);
}
