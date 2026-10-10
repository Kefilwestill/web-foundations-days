let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
  return notes.filter(note =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

function countByCategory() {
  let counts = {};

  for (let note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}

function getSummary() {
  let counts = countByCategory();

  let total = notes.length;
  let noteWord = total === 1 ? "note" : "notes";

  return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(
    note => note.text.trim().toLowerCase() === cleanedText
  );
}

function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];

  if (text.length < 1 || text.length > 200) {
    console.log("Invalid note length.");
    return false;
  }

  if (isDuplicate(text)) {
    console.log("Duplicate note.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.log("Invalid category.");
    return false;
  }

  let newId = notes.length > 0
    ? Math.max(...notes.map(note => note.id)) + 1
    : 1;

  notes.push({
    id: newId,
    text: text,
    category: category
  });

  return true;
}


console.log(searchNotes("milk")); 
console.log(searchNotes("holiday")); 

console.log(longestNote()); 
notes.length = notes.length;

console.log(countByCategory());

console.log(getSummary());

console.log(isDuplicate("Call mum")); 
console.log(isDuplicate("Go to gym")); 

console.log(addNote("Attend JavaScript workshop", "study")); 
console.log(addNote("Call mum", "personal")); 
console.log(notes);