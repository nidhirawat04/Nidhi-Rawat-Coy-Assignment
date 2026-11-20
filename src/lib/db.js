
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

const names = [
  "Aarav", "Ananya", "Rohan", "Isha", "Kabir",
  "Meera", "Arjun", "Sana", "Vihaan", "Aditi",
  "Reyansh", "Kiara", "Dev", "Tara", "Aditya",
  "Zoya", "Ishaan", "Riya", "Krish", "Myra",
  "Vivaan", "Diya", "Atharv", "Naina", "Neil",
  "Avni", "Rudra", "Sara", "Kian", "Mira"
];

const cities = [
  "Delhi", "Mumbai", "Bangalore", "Pune", "Jaipur",
  "Hyderabad", "Chandigarh", "Noida", "Gurgaon", "Kolkata"
];

const bios = [
  "Coffee lover and weekend explorer.",
  "Always looking for new adventures.",
  "Music, movies and meaningful conversations.",
  "Finding joy in little things.",
  "Bookworm with a curious mind.",
  "Here for good conversations and good food."
];

const interests = [
  ["Travel", "Photography", "Music"],
  ["Reading", "Coffee", "Movies"],
  ["Fitness", "Food", "Hiking"],
  ["Art", "Music", "Travel"],
  ["Technology", "Gaming", "Movies"],
  ["Dancing", "Fashion", "Food"]
];

function createProfiles() {
  return names.map((name, index) => ({
    id: `p${String(index + 1).padStart(2, "0")}`,
    name,
    age: 20 + (index % 8),
    photo: `https://i.pravatar.cc/600?img=${index + 1}`,
    bio: bios[index % bios.length],
    city: cities[index % cities.length],
    college: index % 2 === 0 ? "Delhi University" : "University Student",
    interests: interests[index % interests.length]
  }));
}

export async function readDB() {
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });

    let content;

    try {
      content = await fs.readFile(dbPath, "utf-8");
    } catch {
      content = null;
    }

    if (!content) {
      const initialData = {
        profiles: createProfiles(),
        incomingLikes: ["p03", "p08", "p14", "p21", "p27"],
        swipes: [],
        matches: []
      };

      await writeDB(initialData);
      return initialData;
    }

    return JSON.parse(content);
  } catch (error) {
    throw new Error("Unable to read database: " + error.message);
  }
}

export async function writeDB(data) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });

  await fs.writeFile(
    dbPath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}
