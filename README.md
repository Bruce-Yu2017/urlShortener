# URL Shortener App

## Quick Start

```bash
# Install UI dependencies in the root of the project
npm install

# Install Server dependencies
cd server
npm install

# Run both UI and server in the root of the project
npm run dev

# Once both servers are running, open your browser and go to this url:
http://localhost:3000/
```

## Project Description
1. This project includes two parts: UI part is created by react, and server part is created by nodejs(express).
2. There is no database running on this app. Data is saved in ```data.json``` in ```/server/data```. Read and write data into ```data.json``` through ```fs``` package from nodejs.
3. There are two main parts in UI, a URL input form and a table to display all created shortened URLs.
4. User can enter any text to input field. 
5. If it is an invalid URL, an error message will show up. 
6. If it is a valid format
   6.1 If this URL is already exist in our data, the row of that URL from the table will be highlighted.
   6.2 If this URL is NOT exist, will make an api request ```POST /api/createUrl```, and get a new shortened URL as response.
7. In table area, user can see all the URLs with its original URL and shortened URL. If user click the shortened URL, a new browser tab will be opened and navigate to the original website. User can also copy the shortened URL and paste into a new tab, this way will also navigate to the original website.

## APIs

###```GET /:code```
Redirect to the original website. 
Example: ```http://localhost:5000/Sp7Rn6S7X```

###```GET /api/all```
Return all exist shortened URLs.
```
[{"code":"w-STcpFdq","longUrl":"https://getbootstrap.com/","shortenUrl":"http://localhost:5000/w-STcpFdq","date":1618619668575},{"code":"EtOVluaa5","longUrl":"https://codebeautify.org/jsonviewer","shortenUrl":"http://localhost:5000/EtOVluaa5","date":1618619734963}]
```

###```POST /api/createUrl```
Create a new shortened URL. 

Payload: 
```
{"longUrl":"https://codebeautify.org/jsonviewer"}
```

Response: 
```
{"code":"SA-Ao1Ykd","longUrl":"https://translate.google.com/?hl=en&tab=TT","shortenUrl":"http://localhost:5000/SA-Ao1Ykd","date":1618619879896}
```
