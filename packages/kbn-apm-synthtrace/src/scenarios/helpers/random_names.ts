/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export const randomGreekishNames = [
  'Adonis',
  'Agamemnon',
  'Ajax',
  'Alexander',
  'Aphrodite',
  'Apollo',
  'Ares',
  'Aristophanes',
  'Artemis',
  'Athena',
  'Atlas',
  'Boreas',
  'Calliope',
  'Cassandra',
  'Clio',
  'Daphne',
  'Demeter',
  'Dionysius',
  'Dionysus',
  'Eileithyia',
  'Electra',
  'Eos',
  'Erato',
  'Erebos',
  'Eros',
  'Euterpe',
  'Gaia',
  'Hades',
  'Hecate',
  'Helios',
  'Hephaestus',
  'Hera',
  'Heracles (Hercules)',
  'Hercules',
  'Hermes',
  'Hestia',
  'Hypatia',
  'Hypnos',
  'Iphigenia',
  'Iris',
  'Kratos',
  'Leonidas',
  'Medusa',
  'Mnemosyne',
  'Morpheus',
  'Narcissus',
  'Nemesis',
  'Nike',
  'Notus',
  'Nyx',
  'Oceanus',
  'Odysseus',
  'Orpheus',
  'Pan',
  'Pandora',
  'Penelope',
  'Pericles',
  'Persephone',
  'Perseus',
  'Phoebe',
  'Polyphemus',
  'Pontus',
  'Poseidon',
  'Priam',
  'Prometheus',
  'Rhea',
  'Sappho',
  'Selene',
  'Terpsichore',
  'Tethys',
  'Thalia',
  'Thanatos',
  'Theia',
  'Theseus',
  'Thetis',
  'Triton',
  'Tyche',
  'Uranus',
  'Zephyrus',
  'Zeus',
  'Augustus',
  'Bacchus',
  'Brutus',
  'Caesar',
  'Caligula',
  'Caracalla',
  'Cassius',
  'Cato',
  'Cicero',
  'Cleopatra',
  'Commodus',
  'Constantine',
  'Diana',
  'Domitian',
  'Hadrian',
  'Horace',
  'Julius',
  'Juno',
  'Jupiter',
  'Livy',
  'Marcus Aurelius',
  'Mars',
  'Mercury',
  'Minerva',
  'Neptune',
  'Nero',
  'Octavian',
  'Ovid',
  'Pliny',
  'Pluto',
  'Pompey',
  'Remus',
  'Romulus',
  'Saturn',
  'Scipio',
  'Seneca',
  'Spartacus',
  'Theodosius',
  'Tiberius',
  'Titus',
  'Trajan',
  'Venus',
  'Vespasian',
  'Vesta',
  'Virgil',
];

export function getRandomNameForIndex(index: number) {
  return randomGreekishNames[index % randomGreekishNames.length];
}