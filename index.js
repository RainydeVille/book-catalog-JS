async function getAllBooks() {
    const promise = await fetch("https://in3.dev/knygos/");
    const data = await promise.json();
    return data;
}

async function getAllBookTypes() {
    const promise = await fetch("https://in3.dev/knygos/types/");
    const data = await promise.json();
    return data;
}

function showSelectOptions(selectOptions=[]) {
    const select = document.querySelector("#book-genre-selection");
    let html = "<option selected value='Visi žanrai'>Visi žanrai</option>";
    selectOptions.forEach((bookType)=>{
        html += `<option>${bookType.title}</option>`
    });
    select.innerHTML = html;
}

function showBooks(books=[]) {
    let html = "";

    books.forEach((book)=>{
        html += `<div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${book.id}" aria-expanded="false" aria-controls="collapse-${book.id}">
       ${book.title}
      </button>
    </h2>
    <div id="collapse-${book.id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#bookAccordion">
      <div class="accordion-body row row-cols-12">
        <img class="col-12 col-sm-3 col-lg-2" style="max-width: 300px" src="${book.img}" alt="knygos nuotrauka ${book.title}">
        <div class="col-12 col-sm-9 col-lg-10">
        <p><b>Autorius: </b><i>${book.author}</i></p>
        <p><b>Kaina: </b><i>${book.price.toFixed(2)}</i></p>
        <p><b>Išleidimo data: </b><i>${new Date(book.time*1000).toLocaleDateString("lt")}</i></p>
        <p><b>Žanras: </b><i>${book.type}</i></p>
      </div>
      </div>
    </div>
  </div>`
    });

    document.querySelector("#bookAccordion").innerHTML = html;
}

let allBooks = [];

async function main() {
    const [books, bookTypes] = await Promise.all([getAllBooks(), getAllBookTypes()]);

    allBooks = books.map((book)=>{
        book.type = bookTypes.find((bookType)=>bookType.id == book.type).title;
        console.log(book);
        return book;
    });

    showSelectOptions(bookTypes);
    showBooks(allBooks);
}

main();

document.querySelector("#searchBtn").addEventListener("click", (e)=>{
    e.preventDefault();

    const searchInput = document.querySelector("#search").value.trim().toLowerCase();
    const selectedGenre = document.querySelector("#book-genre-selection").value;

    const filteredBooks = allBooks.filter((book)=>{
        const matchesText = book.title.toLowerCase().includes(searchInput) ||
                            book.author.toLowerCase().includes(searchInput) ||
                            book.type.toLowerCase().includes(searchInput);
        
        const matchesGenre = selectedGenre === "Visi žanrai" || book.type === selectedGenre;

        return matchesText && matchesGenre;
    });
    
    showBooks(filteredBooks);
});

document.querySelector("#resetBtn").addEventListener("click", ()=>{
    showBooks(allBooks);
    document.querySelector("form").reset();
});