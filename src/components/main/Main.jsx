import React, { useState, useEffect } from "react";
import axios from "axios";
import validUrl from "valid-url";

export const Main = ({handlePromise}) => {
  //Handle url input field state
  const [url, setUrl] = useState("");

  //Handle error state, if it is not empty, the error bar will show
  const [error, setError] = useState("");

  //Handle urls list state, list data is from server response 
  const [urls, setUrls] = useState([]);

  //Handle input onchange event
  const onchange = async (e) => {
    e.preventDefault();

    //handlePromise callback is only used in testing to avoid act() warning
    if(handlePromise) {
      await handlePromise();
    }
    setError("");
    setUrl(e.target.value.trim());
  };

  //Trigger api call to create a new shortened url
  const createUrl = async (payload) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/createUrl",
        payload
      );
      setUrls([data, ...urls]);
    } catch (error) {
      setError(error);
    }
  };

  //If an exist url is entered, will highlight the row in table
  const highLightRow = (row) => {
    const id = row.code;
    document.getElementById(id).style.backgroundColor='#e8d7d7';
    setError('This URL is already exist. Please try another one.')
    setTimeout(() => {
      document.getElementById(id).style.backgroundColor='';
      setError('');
    }, 2000);
  }

  //Handle form submit event
  const onsubmit = (e) => {
    e.preventDefault();
    const isValidUrl = validUrl.isUri(url);
    if (!isValidUrl) {
      setError("Please enter a valid URL.");
      return;
    }
    const isUrlExist = urls.find((u) => {
      return u.longUrl === url;
    });
    if (isUrlExist) {
      highLightRow(isUrlExist);
    } else {
      const data = { longUrl: url };
      createUrl(data);
    }
  };

  //When project load, load all exist urls from server
  useEffect(() => {
    let isCancelled = false;
    const loadUrls = async () => {
      try {
        if (!isCancelled) {
          const { data } = await axios.get("http://localhost:5000/api/all");
          data.sort((a, b) => {
            return b.date - a.date;
          })
          setUrls(data);
        }
      } catch (error) {
        setError(error);
      }
    };
    loadUrls();

    return () => {
      isCancelled = true;
      setUrls([]);
      setError('');
      setUrl('');
    };
  }, []);

  return (
    <div className="container mt-5">
      <h1>URL Shortener</h1>
      <form onSubmit={(e) => onsubmit(e)}>
        <label data-testid="urlForm">Enter URL Here:</label>
        <input
          value={url}
          type="text"
          onChange={(e) => onchange(e)}
          className="ml-2"
          data-testid="urlInput"
        />
        <button
          type="submit"
          className="btn btn-success ml-2"
          disabled={url.length === 0 || error.length > 0}
        >
          Create
        </button>
      </form>

      {error && <span className="text-danger">{error}</span>}

      {urls.length > 0 && (
        <table className="table table-bordered mt-3" data-testid="urlTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Original URL</th>
              <th>Shortened URL</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((u, index) => {
              return (
                <tr key={u.code} id={u.code}>
                  <td>{index + 1}</td>
                  <td>{u.longUrl}</td>
                  <td>
                    <a
                      href={u.longUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {u.shortenUrl}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
