const apiKey = "<YOUR_API_KEY_HERE>"


const bookInput = document.getElementById('bookInput');
const chapterInput = document.getElementById('chapterInput');
const verseInput = document.getElementById('verseInput');
const fetchButton = document.getElementById('fetchButton');
const verseOutput = document.getElementById('verseOutput');
const form = document.getElementById('dialogBox');

async function getBooks() {
    try {
        const response = await fetch(`https://api.scripture.api.bible/v1/bibles/7644de2e4c5188e5-01/books?include-chapters=true&include-chapters-and-sections=false`,
            {
                headers: {
                    "api-key": apiKey,
                    }
            });
    
        const data = await response.json();
        
        return data.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

async function populateBooks() {
    const books = await getBooks();

    books.forEach((book) => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = book.name;
        bookInput.appendChild(option);
    });

    bookInput.disabled = false;
}

async function populateChapters() {
    const bookId = bookInput.value;

    if (!bookId) {
        chapterInput.disabled = true;
        verseInput.disabled = true;
        fetchButton.disabled = true;
        verseOutput.textContent = '';
        return;
    }

    const books = await getBooks();
    const selectedBook = books.find((book) => book.id === bookId);

    if (!selectedBook || !selectedBook.chapters) {
        chapterInput.disabled = true;
        verseInput.disabled = true;
        fetchButton.disabled = true;
        verseOutput.textContent = '';
        return;
    }


    selectedBook.chapters.forEach((chapter) => {
        const option = document.createElement('option');
        option.value = chapter.id;
        option.textContent = chapter.number;
        chapterInput.appendChild(option);
    });

    chapterInput.disabled = false;
    verseInput.disabled = true;
    fetchButton.disabled = true;
    verseOutput.textContent = '';
}

async function getVerses(chapterId) {
    try {
        const response = await fetch(`https://api.scripture.api.bible/v1/bibles/7644de2e4c5188e5-01/chapters/${chapterId}/verses`,
            {
                headers: {
                    "api-key": apiKey,
                    },
            });
        const data = await response.json();

        return data.data;
    } catch (error) {
        console.error('Error fetching verses:', error);
        return [];
    }
}

async function populateVerses() {
    const bookId = bookInput.value;
    const chapterId = chapterInput.value;

    if (!bookId || !chapterId) {
        verseInput.disabled = true;
        fetchButton.disabled = true;
        verseOutput.textContent = '';
        return;
    }

    const verses = await getVerses(chapterId);

    verses.forEach((verse) => {
        const option = document.createElement('option');
        option.value = verse.id;
        option.textContent = verse.reference;
        verseInput.appendChild(option);
    });

    verseInput.disabled = false;
    fetchButton.disabled = true;
    verseOutput.textContent = '';
}

function enableFetchButton() {
    fetchButton.disabled = false;
}

async function fetchSelectedVerse() {
    const bookId = bookInput.value;
    const chapterId = chapterInput.value;
    const verseId = verseInput.value;
    
    if (!bookId || !chapterId || !verseId) {
        alert('Please select a book, chapter, and verse.');
        return;
    }

    try {
        const response = await fetch(`https://api.scripture.api.bible/v1/bibles/7644de2e4c5188e5-01/verses/${verseId}?content-type=text&parallels=9879dbb7cfe39e4d-02`, 
            {
                headers: { 
                    "api-key": apiKey,
                }
            });
        const data = await response.json();
        const verseContent = data.data.content;
        const translation = data.data.parallels[0].content;

        verseOutput.textContent = verseContent
        document.getElementById("translationOutput").textContent = translation;
    } catch (error) {
        console.error('Error fetching verse:', error);
        verseOutput.textContent = 'Error fetching verse.';
    }
}

bookInput.addEventListener('change', populateChapters);
chapterInput.addEventListener('change', populateVerses);
verseInput.addEventListener('change', enableFetchButton);
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    fetchSelectedVerse(); // Call the fetchSelectedVerse function when the form is submitted
});
// Populate books when the page loads
populateBooks();
