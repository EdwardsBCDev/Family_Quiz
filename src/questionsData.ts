import { Question, Category } from './types';

export const questionsPool: Question[] = [
  // --- DISNEY ---
  { id: 'd1', category: Category.DISNEY, text: "In 'The Lion King', what is the name of Simba's mother?", options: ["Nala", "Sarabi", "Zira", "Shenzi"], correctIndex: 1, explanation: "Sarabi is Mufasa's queen.", isBonus: false },
  { id: 'd2', category: Category.DISNEY, text: "Which Disney Princess has a raccoon sidekick?", options: ["Pocahontas", "Snow White", "Merida", "Rapunzel"], correctIndex: 0, explanation: "Meeko is the raccoon.", isBonus: false },
  { id: 'd3', category: Category.DISNEY, text: "Name the toy store in 'Toy Story 2'.", options: ["Al's Toy Barn", "Toys R Us", "Pizza Planet", "Sid's Toys"], correctIndex: 0, explanation: "Al McWhiggin owns it.", isBonus: false },
  { id: 'd4', category: Category.DISNEY, text: "First Disney character on the Walk of Fame?", options: ["Snow White", "Mickey Mouse", "Donald Duck", "Walt"], correctIndex: 1, explanation: "Mickey got it in 1978.", isBonus: true },
  { id: 'd5', category: Category.DISNEY, text: "Frozen's snow monster name?", options: ["Snowball", "Marshmallow", "Olaf", "Slushy"], correctIndex: 1, explanation: "Marshmallow guards the palace.", isBonus: false },
  { id: 'd6', category: Category.DISNEY, text: "Setting of 'Princess and the Frog'?", options: ["Paris", "New York", "New Orleans", "London"], correctIndex: 2, explanation: "It's New Orleans.", isBonus: false },
  { id: 'd7', category: Category.DISNEY, text: "Hakuna Matata means?", options: ["No worries", "Good luck", "Live life", "Be happy"], correctIndex: 0, explanation: "No worries!", isBonus: false },
  { id: 'd8', category: Category.DISNEY, text: "Song 'You Can Fly' is in?", options: ["Dumbo", "Peter Pan", "Aladdin", "Mary Poppins"], correctIndex: 1, explanation: "Peter Pan.", isBonus: false },
  { id: 'd9', category: Category.DISNEY, text: "Pub name in Tangled?", options: ["Snuggly Duckling", "Rusty Horseshoe", "Poisoned Apple", "Golden Goose"], correctIndex: 0, explanation: "The Snuggly Duckling.", isBonus: false },
  { id: 'd10', category: Category.DISNEY, text: "Incredibles fashion designer?", options: ["Coco", "Edna Mode", "Cruella", "Medusa"], correctIndex: 1, explanation: "Edna Mode. No capes!", isBonus: false },
  
  // --- MUSIC ---
  { id: 'm1', category: Category.MUSIC, text: "King of Pop?", options: ["Elvis", "Michael Jackson", "Prince", "Freddie"], correctIndex: 1, explanation: "MJ is the King of Pop.", isBonus: false },
  { id: 'm2', category: Category.MUSIC, text: "Released 'Abbey Road'?", options: ["Stones", "The Who", "The Beatles", "Floyd"], correctIndex: 2, explanation: "The Beatles.", isBonus: false },
  { id: 'm3', category: Category.MUSIC, text: "Started as Hannah Montana?", options: ["Selena", "Demi", "Miley Cyrus", "Ariana"], correctIndex: 2, explanation: "Miley Cyrus.", isBonus: false },
  { id: 'm4', category: Category.MUSIC, text: "Sang 'Shape of You'?", options: ["Bieber", "Styles", "Ed Sheeran", "Mendes"], correctIndex: 2, explanation: "Ed Sheeran.", isBonus: false },
  { id: 'm5', category: Category.MUSIC, text: "NOT a Spice Girl?", options: ["Scary", "Sporty", "Ginger", "Salt"], correctIndex: 3, explanation: "Salt Spice doesn't exist.", isBonus: false },
  { id: 'm6', category: Category.MUSIC, text: "Violin strings count?", options: ["4", "6", "5", "3"], correctIndex: 0, explanation: "Four strings.", isBonus: true },
  { id: 'm7', category: Category.MUSIC, text: "2024 Super Bowl performer?", options: ["Rihanna", "Usher", "Weeknd", "Beyonce"], correctIndex: 1, explanation: "Usher.", isBonus: false },
  { id: 'm8', category: Category.MUSIC, text: "Band named after Foo Fighter?", options: ["Foo Fighters", "Nirvana", "Pearl Jam", "U2"], correctIndex: 0, explanation: "Foo Fighters.", isBonus: false },
  { id: 'm9', category: Category.MUSIC, text: "The Material Girl?", options: ["Cyndi", "Madonna", "Cher", "Britney"], correctIndex: 1, explanation: "Madonna.", isBonus: false },
  { id: 'm10', category: Category.MUSIC, text: "Wrote Bohemian Rhapsody?", options: ["May", "Mercury", "Taylor", "Deacon"], correctIndex: 1, explanation: "Freddie Mercury.", isBonus: false },

  // --- GENERAL ---
  { id: 'g1', category: Category.GENERAL, text: "Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correctIndex: 2, explanation: "Mars.", isBonus: false },
  { id: 'g2', category: Category.GENERAL, text: "Octopus hearts?", options: ["1", "2", "3", "4"], correctIndex: 2, explanation: "Three hearts.", isBonus: true },
  { id: 'g3', category: Category.GENERAL, text: "Capital of France?", options: ["Rome", "Madrid", "Berlin", "Paris"], correctIndex: 3, explanation: "Paris.", isBonus: false },
  { id: 'g4', category: Category.GENERAL, text: "Symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Olive"], correctIndex: 1, explanation: "Oxygen.", isBonus: false },
  { id: 'g5', category: Category.GENERAL, text: "Days in leap year?", options: ["365", "364", "366", "367"], correctIndex: 2, explanation: "366 days.", isBonus: false },
  { id: 'g6', category: Category.GENERAL, text: "Painted Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], correctIndex: 2, explanation: "Da Vinci.", isBonus: false },
  { id: 'g7', category: Category.GENERAL, text: "Fastest land animal?", options: ["Lion", "Gazelle", "Cheetah", "Leopard"], correctIndex: 2, explanation: "Cheetah.", isBonus: false },
  { id: 'g8', category: Category.GENERAL, text: "Largest Ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correctIndex: 3, explanation: "Pacific.", isBonus: false },
  { id: 'g9', category: Category.GENERAL, text: "Hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Platinum"], correctIndex: 2, explanation: "Diamond.", isBonus: false },
  { id: 'g10', category: Category.GENERAL, text: "Chemical symbol for Gold?", options: ["Au", "Ag", "Fe", "Go"], correctIndex: 0, explanation: "Au (Aurum).", isBonus: true }
];
