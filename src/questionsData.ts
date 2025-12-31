import { Question, Category } from './types';

export const questionsPool: Question[] = [
  // ==========================================
  // DISNEY CATEGORY
  // ==========================================
  {
    id: 'd1',
    category: Category.DISNEY,
    text: "In 'The Lion King', what is the name of Simba's mother?",
    options: ["Nala", "Sarabi", "Zira", "Shenzi"],
    correctIndex: 1,
    explanation: "Sarabi is Mufasa's queen and Simba's mother.",
    isBonus: false
  },
  {
    id: 'd2',
    category: Category.DISNEY,
    text: "Which Disney Princess has a raccoon as a sidekick?",
    options: ["Pocahontas", "Snow White", "Merida", "Rapunzel"],
    correctIndex: 0,
    explanation: "Meeko is the mischievous raccoon in Pocahontas.",
    isBonus: false
  },
  {
    id: 'd3',
    category: Category.DISNEY,
    text: "What is the name of the toy store in 'Toy Story 2'?",
    options: ["Al's Toy Barn", "Toys R Us", "Pizza Planet", "Sid's Toys"],
    correctIndex: 0,
    explanation: "Al McWhiggin owns Al's Toy Barn.",
    isBonus: false
  },
  {
    id: 'd4',
    category: Category.DISNEY,
    text: "Who was the first Disney character to get a star on the Hollywood Walk of Fame?",
    options: ["Snow White", "Mickey Mouse", "Donald Duck", "Walt Disney"],
    correctIndex: 1,
    explanation: "Mickey received his star in 1978.",
    isBonus: true
  },
  {
    id: 'd5',
    category: Category.DISNEY,
    text: "In 'Frozen', what is the name of the giant snow monster?",
    options: ["Snowball", "Marshmallow", "Olaf", "Slushy"],
    correctIndex: 1,
    explanation: "Elsa creates Marshmallow to guard her palace.",
    isBonus: false
  },
  {
    id: 'd6',
    category: Category.DISNEY,
    text: "What city is the setting for 'The Princess and the Frog'?",
    options: ["Paris", "New York", "New Orleans", "London"],
    correctIndex: 2,
    explanation: "It is set in 1920s New Orleans.",
    isBonus: false
  },
  {
    id: 'd7',
    category: Category.DISNEY,
    text: "What does Hakuna Matata mean?",
    options: ["No worries", "Good luck", "Live life", "Be happy"],
    correctIndex: 0,
    explanation: "It means no worries for the rest of your days!",
    isBonus: false
  },
  {
    id: 'd8',
    category: Category.DISNEY,
    text: "Which Disney movie features the song 'You Can Fly'?",
    options: ["Dumbo", "Peter Pan", "Aladdin", "Mary Poppins"],
    correctIndex: 1,
    explanation: "Peter Pan teaches the darling children to fly.",
    isBonus: false
  },
  {
    id: 'd9',
    category: Category.DISNEY,
    text: "What is the name of the pub in 'Tangled'?",
    options: ["The Snuggly Duckling", "The Rusty Horseshoe", "The Poisoned Apple", "The Golden Goose"],
    correctIndex: 0,
    explanation: "It's where the ruffians sing 'I've Got a Dream'.",
    isBonus: false
  },
  {
    id: 'd10',
    category: Category.DISNEY,
    text: "Who is the fashion designer in 'The Incredibles'?",
    options: ["Coco Chanel", "Edna Mode", "Cruella de Vil", "Madame Medusa"],
    correctIndex: 1,
    explanation: "Edna Mode designs the supers' suits. No capes!",
    isBonus: false
  },
  {
    id: 'd11',
    category: Category.DISNEY,
    text: "What is the name of the kingdom in 'Frozen'?",
    options: ["Genovia", "Arendelle", "Corona", "Atlantica"],
    correctIndex: 1,
    explanation: "Anna and Elsa are princesses of Arendelle.",
    isBonus: false
  },
  {
    id: 'd12',
    category: Category.DISNEY,
    text: "Which Disney character sings 'Kiss the Girl'?",
    options: ["Sebastian", "Flounder", "Scuttle", "King Triton"],
    correctIndex: 0,
    explanation: "Sebastian sings it to set the mood for Ariel and Eric.",
    isBonus: false
  },
  {
    id: 'd13',
    category: Category.DISNEY,
    text: "In 'Monsters, Inc.', what is Sulley's full name?",
    options: ["James P. Sullivan", "John P. Sullivan", "Jim S. Sullivan", "Jack P. Sullivan"],
    correctIndex: 0,
    explanation: "His full name is James P. Sullivan.",
    isBonus: false
  },
  {
    id: 'd14',
    category: Category.DISNEY,
    text: "What animal does Jafar turn into in 'Aladdin'?",
    options: ["A giant cobra", "A dragon", "A lion", "A bear"],
    correctIndex: 0,
    explanation: "He turns into a giant cobra to fight Aladdin.",
    isBonus: false
  },
  {
    id: 'd15',
    category: Category.DISNEY,
    text: "Who was the first Disney princess?",
    options: ["Cinderella", "Snow White", "Aurora", "Belle"],
    correctIndex: 1,
    explanation: "Snow White and the Seven Dwarfs was released in 1937.",
    isBonus: false
  },
  {
    id: 'd16',
    category: Category.DISNEY,
    text: "What is the name of the tea cup in 'Beauty and the Beast'?",
    options: ["Chip", "Dale", "Pip", "Spot"],
    correctIndex: 0,
    explanation: "Chip is Mrs. Potts' son.",
    isBonus: false
  },
  {
    id: 'd17',
    category: Category.DISNEY,
    text: "What kind of animal is Baloo in 'The Jungle Book'?",
    options: ["Grizzly Bear", "Sloth Bear", "Polar Bear", "Panda"],
    correctIndex: 1,
    explanation: "Baloo is a Sloth Bear.",
    isBonus: true
  },
  {
    id: 'd18',
    category: Category.DISNEY,
    text: "Which movie features the song 'Circle of Life'?",
    options: ["Tarzan", "The Lion King", "Mulan", "Pocahontas"],
    correctIndex: 1,
    explanation: "It is the opening song of The Lion King.",
    isBonus: false
  },
  {
    id: 'd19',
    category: Category.DISNEY,
    text: "What is the name of Mulan's dragon sidekick?",
    options: ["Mushu", "Sisu", "Spyro", "Toothless"],
    correctIndex: 0,
    explanation: "Mushu is the guardian spirit sent to protect Mulan.",
    isBonus: false
  },
  {
    id: 'd20',
    category: Category.DISNEY,
    text: "In 'Finding Nemo', what address does Dory remember?",
    options: ["42 Wallaby Way, Sydney", "221B Baker St, London", "742 Evergreen Terrace", "31 Spooner Street"],
    correctIndex: 0,
    explanation: "P. Sherman, 42 Wallaby Way, Sydney.",
    isBonus: false
  },
  {
    id: 'd21',
    category: Category.DISNEY,
    text: "What is the name of the fairy in 'Peter Pan'?",
    options: ["Flora", "Fauna", "Merryweather", "Tinker Bell"],
    correctIndex: 3,
    explanation: "Tinker Bell is Peter Pan's fairy companion.",
    isBonus: false
  },
  {
    id: 'd22',
    category: Category.DISNEY,
    text: "Which character is NOT one of the Seven Dwarfs?",
    options: ["Sleepy", "Doc", "Grouchy", "Dopey"],
    correctIndex: 2,
    explanation: "There is no dwarf named Grouchy; there is Grumpy.",
    isBonus: false
  },
  {
    id: 'd23',
    category: Category.DISNEY,
    text: "Who is the villain in 'The Little Mermaid'?",
    options: ["Maleficent", "Ursula", "Cruella", "Gothel"],
    correctIndex: 1,
    explanation: "Ursula the Sea Witch.",
    isBonus: false
  },
  {
    id: 'd24',
    category: Category.DISNEY,
    text: "What is the name of the cowboy doll in 'Toy Story'?",
    options: ["Buzz", "Woody", "Jessie", "Bullseye"],
    correctIndex: 1,
    explanation: "Sheriff Woody Pride.",
    isBonus: false
  },
  {
    id: 'd25',
    category: Category.DISNEY,
    text: "In 'Up', where does Carl want to move his house?",
    options: ["Paradise Falls", "Angel Falls", "Niagara Falls", "Victoria Falls"],
    correctIndex: 0,
    explanation: "He wants to go to Paradise Falls in South America.",
    isBonus: false
  },
  {
    id: 'd26',
    category: Category.DISNEY,
    text: "Who provided the voice for the Genie in 'Aladdin' (1992)?",
    options: ["Eddie Murphy", "Robin Williams", "Will Smith", "Jim Carrey"],
    correctIndex: 1,
    explanation: "Robin Williams gave an iconic performance.",
    isBonus: false
  },
  {
    id: 'd27',
    category: Category.DISNEY,
    text: "What is the name of the robot in 'Wall-E'?",
    options: ["Wall-E", "Eve", "M-O", "Auto"],
    correctIndex: 0,
    explanation: "Waste Allocation Load Lifter Earth-class.",
    isBonus: false
  },
  {
    id: 'd28',
    category: Category.DISNEY,
    text: "What does Mary Poppins say helps the medicine go down?",
    options: ["A spoonful of sugar", "A glass of water", "A pinch of salt", "A drop of honey"],
    correctIndex: 0,
    explanation: "Just a spoonful of sugar helps the medicine go down.",
    isBonus: false
  },
  {
    id: 'd29',
    category: Category.DISNEY,
    text: "Who is the villain in '101 Dalmatians'?",
    options: ["Ursula", "Cruella de Vil", "Maleficent", "Yzma"],
    correctIndex: 1,
    explanation: "Cruella de Vil wants to make a coat out of puppies.",
    isBonus: false
  },
  {
    id: 'd30',
    category: Category.DISNEY,
    text: "What is the name of the tiger in 'The Jungle Book'?",
    options: ["Bagheera", "Shere Khan", "Kaa", "Louie"],
    correctIndex: 1,
    explanation: "Shere Khan is the fearsome tiger.",
    isBonus: false
  },

  // ==========================================
  // MUSIC CATEGORY
  // ==========================================
  {
    id: 'm1',
    category: Category.MUSIC,
    text: "Who is known as the 'King of Pop'?",
    options: ["Elvis Presley", "Michael Jackson", "Prince", "Freddie Mercury"],
    correctIndex: 1,
    explanation: "Michael Jackson is the undisputed King of Pop.",
    isBonus: false
  },
  {
    id: 'm2',
    category: Category.MUSIC,
    text: "Which British band released the album 'Abbey Road'?",
    options: ["The Rolling Stones", "The Who", "The Beatles", "Pink Floyd"],
    correctIndex: 2,
    explanation: "The Beatles released Abbey Road in 1969.",
    isBonus: false
  },
  {
    id: 'm3',
    category: Category.MUSIC,
    text: "What pop star began her career as 'Hannah Montana'?",
    options: ["Selena Gomez", "Demi Lovato", "Miley Cyrus", "Ariana Grande"],
    correctIndex: 2,
    explanation: "Miley Cyrus starred as Hannah Montana on Disney Channel.",
    isBonus: false
  },
  {
    id: 'm4',
    category: Category.MUSIC,
    text: "Who sang the hit song 'Shape of You'?",
    options: ["Justin Bieber", "Harry Styles", "Ed Sheeran", "Shawn Mendes"],
    correctIndex: 2,
    explanation: "Ed Sheeran released this massive hit in 2017.",
    isBonus: false
  },
  {
    id: 'm5',
    category: Category.MUSIC,
    text: "Which spice is NOT a member of the Spice Girls?",
    options: ["Scary", "Sporty", "Ginger", "Salt"],
    correctIndex: 3,
    explanation: "The members were Scary, Sporty, Baby, Ginger, and Posh.",
    isBonus: false
  },
  {
    id: 'm6',
    category: Category.MUSIC,
    text: "How many strings does a standard violin have?",
    options: ["4", "6", "5", "3"],
    correctIndex: 0,
    explanation: "A standard violin has 4 strings (G, D, A, E).",
    isBonus: true
  },
  {
    id: 'm7',
    category: Category.MUSIC,
    text: "Who performed the 2024 Super Bowl Halftime show?",
    options: ["Rihanna", "Usher", "The Weeknd", "Beyoncé"],
    correctIndex: 1,
    explanation: "Usher was the headline performer.",
    isBonus: false
  },
  {
    id: 'm8',
    category: Category.MUSIC,
    text: "What band is named after a Foo Fighter?",
    options: ["Foo Fighters", "Nirvana", "Pearl Jam", "U2"],
    correctIndex: 0,
    explanation: "Dave Grohl formed the Foo Fighters.",
    isBonus: false
  },
  {
    id: 'm9',
    category: Category.MUSIC,
    text: "Which singer is known as the 'Material Girl'?",
    options: ["Cyndi Lauper", "Madonna", "Cher", "Britney Spears"],
    correctIndex: 1,
    explanation: "Madonna released the song 'Material Girl' in 1984.",
    isBonus: false
  },
  {
    id: 'm10',
    category: Category.MUSIC,
    text: "Who wrote 'Bohemian Rhapsody'?",
    options: ["Brian May", "Freddie Mercury", "Roger Taylor", "John Deacon"],
    correctIndex: 1,
    explanation: "Freddie Mercury wrote the masterpiece for Queen.",
    isBonus: false
  },
  {
    id: 'm11',
    category: Category.MUSIC,
    text: "Which country is ABBA from?",
    options: ["Norway", "Denmark", "Sweden", "Germany"],
    correctIndex: 2,
    explanation: "ABBA is a Swedish pop group.",
    isBonus: false
  },
  {
    id: 'm12',
    category: Category.MUSIC,
    text: "What is the name of Taylor Swift's first re-recorded album?",
    options: ["Red (TV)", "Fearless (TV)", "Speak Now (TV)", "1989 (TV)"],
    correctIndex: 1,
    explanation: "Fearless (Taylor's Version) was released first in 2021.",
    isBonus: true
  },
  {
    id: 'm13',
    category: Category.MUSIC,
    text: "Who sings 'Rolling in the Deep'?",
    options: ["Adele", "Sia", "Katy Perry", "Lady Gaga"],
    correctIndex: 0,
    explanation: "Adele released this hit on her album '21'.",
    isBonus: false
  },
  {
    id: 'm14',
    category: Category.MUSIC,
    text: "What instrument does Lizzo play?",
    options: ["Piano", "Flute", "Guitar", "Violin"],
    correctIndex: 1,
    explanation: "She is a classically trained flutist.",
    isBonus: false
  },
  {
    id: 'm15',
    category: Category.MUSIC,
    text: "Who is the lead singer of Coldplay?",
    options: ["Chris Martin", "Thom Yorke", "Bono", "Sting"],
    correctIndex: 0,
    explanation: "Chris Martin fronts the band Coldplay.",
    isBonus: false
  },
  {
    id: 'm16',
    category: Category.MUSIC,
    text: "What was the first music video played on MTV?",
    options: ["Thriller", "Video Killed the Radio Star", "Take On Me", "Money for Nothing"],
    correctIndex: 1,
    explanation: "It aired on August 1, 1981.",
    isBonus: true
  },
  {
    id: 'm17',
    category: Category.MUSIC,
    text: "Which artist has fans called 'Little Monsters'?",
    options: ["Lady Gaga", "Katy Perry", "Nicki Minaj", "Rihanna"],
    correctIndex: 0,
    explanation: "Lady Gaga affectionately calls her fans Little Monsters.",
    isBonus: false
  },
  {
    id: 'm18',
    category: Category.MUSIC,
    text: "What is the real name of Eminem?",
    options: ["Marshall Mathers", "Curtis Jackson", "Calvin Broadus", "Shawn Carter"],
    correctIndex: 0,
    explanation: "Marshall Bruce Mathers III.",
    isBonus: false
  },
  {
    id: 'm19',
    category: Category.MUSIC,
    text: "Who sang 'I Will Always Love You' for 'The Bodyguard'?",
    options: ["Mariah Carey", "Whitney Houston", "Celine Dion", "Dolly Parton"],
    correctIndex: 1,
    explanation: "Whitney Houston's version became a massive hit.",
    isBonus: false
  },
  {
    id: 'm20',
    category: Category.MUSIC,
    text: "Which band sang 'Smells Like Teen Spirit'?",
    options: ["Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"],
    correctIndex: 0,
    explanation: "Nirvana, led by Kurt Cobain.",
    isBonus: false
  },
  {
    id: 'm21',
    category: Category.MUSIC,
    text: "Who is the 'Rocket Man'?",
    options: ["David Bowie", "Elton John", "Billy Joel", "Paul McCartney"],
    correctIndex: 1,
    explanation: "Elton John is known as the Rocket Man.",
    isBonus: false
  },
  {
    id: 'm22',
    category: Category.MUSIC,
    text: "What group includes Harry Styles, Niall Horan, and Liam Payne?",
    options: ["The Wanted", "One Direction", "BTS", "Backstreet Boys"],
    correctIndex: 1,
    explanation: "One Direction was formed on The X Factor.",
    isBonus: false
  },
  {
    id: 'm23',
    category: Category.MUSIC,
    text: "Which singer is known as the 'Queen of Soul'?",
    options: ["Aretha Franklin", "Diana Ross", "Tina Turner", "Etta James"],
    correctIndex: 0,
    explanation: "Aretha Franklin earned this title.",
    isBonus: false
  },
  {
    id: 'm24',
    category: Category.MUSIC,
    text: "What song starts with 'Is this the real life? Is this just fantasy?'",
    options: ["Bohemian Rhapsody", "Stairway to Heaven", "Imagine", "Hotel California"],
    correctIndex: 0,
    explanation: "The opening lines of Queen's Bohemian Rhapsody.",
    isBonus: false
  },
  {
    id: 'm25',
    category: Category.MUSIC,
    text: "Who released the album 'Lemonade' in 2016?",
    options: ["Beyoncé", "Solange", "Rihanna", "Nicki Minaj"],
    correctIndex: 0,
    explanation: "Beyoncé released Lemonade as a visual album.",
    isBonus: false
  },
  {
    id: 'm26',
    category: Category.MUSIC,
    text: "Which Beatle was assassinated in 1980?",
    options: ["John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"],
    correctIndex: 0,
    explanation: "John Lennon was shot outside his apartment in NYC.",
    isBonus: false
  },
  {
    id: 'm27',
    category: Category.MUSIC,
    text: "Who sings 'Bad Guy'?",
    options: ["Billie Eilish", "Dua Lipa", "Olivia Rodrigo", "Halsey"],
    correctIndex: 0,
    explanation: "Billie Eilish won big at the Grammys with this song.",
    isBonus: false
  },
  {
    id: 'm28',
    category: Category.MUSIC,
    text: "What genre is Bob Marley associated with?",
    options: ["Jazz", "Reggae", "Blues", "Rock"],
    correctIndex: 1,
    explanation: "He is the most famous Reggae artist of all time.",
    isBonus: false
  },
  {
    id: 'm29',
    category: Category.MUSIC,
    text: "Who is the lead singer of U2?",
    options: ["The Edge", "Bono", "Adam Clayton", "Larry Mullen Jr."],
    correctIndex: 1,
    explanation: "Bono is the frontman of U2.",
    isBonus: false
  },
  {
    id: 'm30',
    category: Category.MUSIC,
    text: "Which artist famously bit the head off a bat?",
    options: ["Alice Cooper", "Ozzy Osbourne", "Gene Simmons", "Marilyn Manson"],
    correctIndex: 1,
    explanation: "Ozzy Osbourne did this during a concert in 1982.",
    isBonus: true
  },

  // ==========================================
  // GENERAL KNOWLEDGE CATEGORY
  // ==========================================
  {
    id: 'g1',
    category: Category.GENERAL,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correctIndex: 2,
    explanation: "Mars appears red due to iron oxide on its surface.",
    isBonus: false
  },
  {
    id: 'g2',
    category: Category.GENERAL,
    text: "How many hearts does an octopus have?",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
    explanation: "They have one main heart and two branchial hearts.",
    isBonus: true
  },
  {
    id: 'g3',
    category: Category.GENERAL,
    text: "What is the capital city of France?",
    options: ["Rome", "Madrid", "Berlin", "Paris"],
    correctIndex: 3,
    explanation: "Paris is the capital of France.",
    isBonus: false
  },
  {
    id: 'g4',
    category: Category.GENERAL,
    text: "Which chemical element has the symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Olive Oil"],
    correctIndex: 1,
    explanation: "O stands for Oxygen on the periodic table.",
    isBonus: false
  },
  {
    id: 'g5',
    category: Category.GENERAL,
    text: "How many days are in a leap year?",
    options: ["365", "364", "366", "367"],
    correctIndex: 2,
    explanation: "A leap year adds Feb 29th, making it 366 days.",
    isBonus: false
  },
  {
    id: 'g6',
    category: Category.GENERAL,
    text: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
    correctIndex: 2,
    explanation: "Leonardo da Vinci painted it in the early 16th century.",
    isBonus: false
  },
  {
    id: 'g7',
    category: Category.GENERAL,
    text: "What is the fastest land animal?",
    options: ["Lion", "Gazelle", "Cheetah", "Leopard"],
    correctIndex: 2,
    explanation: "The cheetah can reach speeds of up to 70 mph.",
    isBonus: false
  },
  {
    id: 'g8',
    category: Category.GENERAL,
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
    explanation: "The Pacific Ocean covers more than 30% of Earth's surface.",
    isBonus: false
  },
  {
    id: 'g9',
    category: Category.GENERAL,
    text: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctIndex: 2,
    explanation: "Diamond is the hardest known natural material.",
    isBonus: false
  },
  {
    id: 'g10',
    category: Category.GENERAL,
    text: "Which country has the largest population?",
    options: ["USA", "India", "China", "Russia"],
    correctIndex: 1,
    explanation: "India surpassed China as the most populous country in 2023.",
    isBonus: false
  },
  {
    id: 'g11',
    category: Category.GENERAL,
    text: "What currency is used in the United Kingdom?",
    options: ["Euro", "Dollar", "Pound Sterling", "Franc"],
    correctIndex: 2,
    explanation: "The Pound Sterling (£) is the official currency.",
    isBonus: false
  },
  {
    id: 'g12',
    category: Category.GENERAL,
    text: "How many bones are in the adult human body?",
    options: ["206", "195", "215", "300"],
    correctIndex: 0,
    explanation: "An adult human has 206 bones.",
    isBonus: false
  },
  {
    id: 'g13',
    category: Category.GENERAL,
    text: "What is the tallest mountain in the world?",
    options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Fuji"],
    correctIndex: 2,
    explanation: "Mount Everest stands at 8,848 meters.",
    isBonus: false
  },
  {
    id: 'g14',
    category: Category.GENERAL,
    text: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    correctIndex: 1,
    explanation: "Mercury is the closest planet to the Sun.",
    isBonus: false
  },
  {
    id: 'g15',
    category: Category.GENERAL,
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
    correctIndex: 2,
    explanation: "William Shakespeare wrote the famous tragedy.",
    isBonus: false
  },
  {
    id: 'g16',
    category: Category.GENERAL,
    text: "What is the freezing point of water in Celsius?",
    options: ["100°C", "0°C", "-10°C", "32°C"],
    correctIndex: 1,
    explanation: "Water freezes at 0 degrees Celsius.",
    isBonus: false
  },
  {
    id: 'g17',
    category: Category.GENERAL,
    text: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctIndex: 1,
    explanation: "The Blue Whale is the largest animal known to have ever lived.",
    isBonus: false
  },
  {
    id: 'g18',
    category: Category.GENERAL,
    text: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctIndex: 2,
    explanation: "Africa, Antarctica, Asia, Australia, Europe, N. America, S. America.",
    isBonus: false
  },
  {
    id: 'g19',
    category: Category.GENERAL,
    text: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctIndex: 1,
    explanation: "Plants absorb Carbon Dioxide for photosynthesis.",
    isBonus: false
  },
  {
    id: 'g20',
    category: Category.GENERAL,
    text: "Which country invented pizza?",
    options: ["France", "USA", "Italy", "Greece"],
    correctIndex: 2,
    explanation: "Modern pizza originated in Naples, Italy.",
    isBonus: false
  },
  {
    id: 'g21',
    category: Category.GENERAL,
    text: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Onion", "Pepper"],
    correctIndex: 1,
    explanation: "Avocado is the base of guacamole.",
    isBonus: false
  },
  {
    id: 'g22',
    category: Category.GENERAL,
    text: "How many players are on a soccer team on the field?",
    options: ["10", "11", "12", "9"],
    correctIndex: 1,
    explanation: "There are 11 players including the goalkeeper.",
    isBonus: false
  },
  {
    id: 'g23',
    category: Category.GENERAL,
    text: "What is the chemical symbol for Gold?",
    options: ["Au", "Ag", "Fe", "Go"],
    correctIndex: 0,
    explanation: "Au comes from the Latin word 'Aurum'.",
    isBonus: true
  },
  {
    id: 'g24',
    category: Category.GENERAL,
    text: "Who was the first person to walk on the moon?",
    options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"],
    correctIndex: 2,
    explanation: "Neil Armstrong, in 1969.",
    isBonus: false
  },
  {
    id: 'g25',
    category: Category.GENERAL,
    text: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctIndex: 1,
    explanation: "Vatican City is the smallest independent state.",
    isBonus: false
  },
  {
    id: 'g26',
    category: Category.GENERAL,
    text: "What year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctIndex: 2,
    explanation: "It ended in 1945.",
    isBonus: false
  },
  {
    id: 'g27',
    category: Category.GENERAL,
    text: "What colors are the five Olympic rings?",
    options: ["Blue, Yellow, Black, Green, Red", "Red, White, Blue, Yellow, Green", "Blue, Red, Purple, Green, Yellow", "Black, White, Red, Blue, Green"],
    correctIndex: 0,
    explanation: "Blue, Yellow, Black, Green, and Red.",
    isBonus: true
  },
  {
    id: 'g28',
    category: Category.GENERAL,
    text: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    correctIndex: 1,
    explanation: "The Nile is generally considered the longest.",
    isBonus: false
  },
  {
    id: 'g29',
    category: Category.GENERAL,
    text: "Which animal is known as the 'Ship of the Desert'?",
    options: ["Horse", "Camel", "Elephant", "Donkey"],
    correctIndex: 1,
    explanation: "Camels are well adapted to desert travel.",
    isBonus: false
  },
  {
    id: 'g30',
    category: Category.GENERAL,
    text: "What is the national animal of Scotland?",
    options: ["Lion", "Eagle", "Unicorn", "Stag"],
    correctIndex: 2,
    explanation: "Yes, the Unicorn is Scotland's national animal.",
    isBonus: true
  }
];
