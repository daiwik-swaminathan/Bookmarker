// Listen for form submission
document.getElementById('myForm').addEventListener('submit', saveBookmark)

function saveBookmark(e)
{
    e.preventDefault()
    
    // extract the name and url of the website entry
    var siteName = document.getElementById('siteName').value
    var siteUrl = document.getElementById('siteUrl').value

    if(!validInput(siteName, siteUrl))
    {
        return false
    }

    // User adds a bookmark
    var bookmark = {
        name: siteName,
        url: siteUrl
    }

    // if there is no local web storage, create it
    if(localStorage.getItem('bookmarks') === null)
    {
        // make the array of bookmarks
        var bookmarks = []

        // add the bookmark to the array
        bookmarks.push(bookmark)

        // set the array to local storage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }    
    else // there is local storage stuff associated with 'bookmarks'
    {
        // get the array of bookmarks
        var bookmarks = JSON.parse(localStorage.getItem('bookmarks'))

        // add the bookmark to the array
        bookmarks.push(bookmark)

        // set the array to local storage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }

    document.getElementById('myForm').reset()

    // call this to update UI
    fetchBookmarks()
}

// fetch submissions
function fetchBookmarks()
{
    // get the array of bookmarks
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'))

    // get output html element
    var bookmarksResult = document.getElementById('bookmarksResults')

    // build output
    bookmarksResult.innerHTML = ''
    for(let i=0; i<bookmarks.length; i++)
    {
        let name = bookmarks[i].name
        let url = bookmarks[i].url

        bookmarksResult.innerHTML +=
        `
            <div class="well">
                <h3>${name} 
                    <a class="btn btn-default" target="_blank" href=${url}>Visit</a>
                    <a onclick="deleteBookmark('${url}')" class="btn btn-danger" href="#">Delete</a>
                </h3>
            </div>
        `
    }
}

// delete bookmark
function deleteBookmark(url)
{
    // get the array of bookmarks
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'))

    for(let i=0; i<bookmarks.length; i++)
    {
        if(bookmarks[i].url === url)
        {
            bookmarks.splice(i, 1)
        }
    }

    // set the array to local storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

    // call this to update UI
    fetchBookmarks()
}

// check for valid input
function validInput(siteName, siteUrl)
{
    if(siteName === '' || siteUrl === '')
    {
        showError('Please fill in both fields.')
        return false
    }

    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    if (!siteUrl.match(regex)) 
    {
        showError("Please enter a valid URL.")
        return false
    }

    return true
}

// display error message with correction
function showError(message)
{
    const div = document.createElement('div');
    div.className = `alert alert-danger`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('#myForm');
    const form = document.querySelector('.form-group');
    container.insertBefore(div, form);
    
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}