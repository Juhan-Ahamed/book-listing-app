const bookListElement = document.getElementById("book-list")
const searchInput = document.getElementById("search")
const genreFilter = document.getElementById("genre")
const paginationElement = document.getElementById("pagination")
let currentPage = 1
let totalPages = 1
let booksData = []
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

// Fetch Books from API
async function fetchBooks(page = 1) {
  const response = await fetch(`https://gutendex.com/books?page=${page}`)
  const data = await response.json()
  booksData = data.results
  displayBooks(booksData)
  setupPagination(data.count)
}

// Display books
function displayBooks(books) {
  bookListElement.innerHTML = books
    .map(
      (book) => `
      <div class="book-item">
        <img src="${book.formats["image/jpeg"] || "placeholder.jpg"}" alt="${
        book.title
      }">
        <h3>${book.title}</h3>
        <p>By: ${book.authors.map((author) => author.name).join(", ")}</p>
        <button class="like-icon" onclick="toggleWishlist(${book.id})">
          ${wishlist.includes(book.id) ? "❤️" : "🤍"}
        </button>
      </div>
    `
    )
    .join("")
}

// Search by title
searchInput.addEventListener("input", () => {
  const filteredBooks = booksData.filter((book) =>
    book.title.toLowerCase().includes(searchInput.value.toLowerCase())
  )
  displayBooks(filteredBooks)
})

// Wishlist functionality
function toggleWishlist(bookId) {
  if (wishlist.includes(bookId)) {
    wishlist = wishlist.filter((id) => id !== bookId)
  } else {
    wishlist.push(bookId)
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  displayBooks(booksData)
}

// Setup pagination
function setupPagination() {
  paginationElement.innerHTML = "" // Clear current pagination

  // "Previous" button
  const prevButton = document.createElement("button")
  prevButton.innerText = "Previous"
  prevButton.disabled = currentPage === 1 // Disable if on the first page
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      fetchBooks(currentPage)
    }
  })
  paginationElement.appendChild(prevButton)

  // Display current page number
  const pageInfo = document.createElement("span")
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`
  paginationElement.appendChild(pageInfo)

  // "Next" button
  const nextButton = document.createElement("button")
  nextButton.innerText = "Next"
  nextButton.disabled = currentPage === totalPages // Disable if on the last page
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++
      fetchBooks(currentPage)
    }
  })
  paginationElement.appendChild(nextButton)
}

// Initial fetch
fetchBooks()
