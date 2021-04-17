import React, { useState, useEffect } from "react";
import axios from "axios";
import validUrl from "valid-url";

export const UrlForm = () => {
  const [url, setUrl] = useState("");

  const [error, setError] = useState("");

  const [urls, setUrls] = useState([]);

  const onchange = (e) => {
    e.preventDefault();
    setError("");
    setUrl(e.target.value.trim());
  };

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

  const highLightRow = (row) => {
    const id = row.code;
    document.getElementById(id).style.backgroundColor='#e8d7d7';
    setError('This URL is already exist. Please try another one.')
    setTimeout(() => {
      document.getElementById(id).style.backgroundColor='';
      setError('');
    }, 2000);
  }

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

  const loadUrls = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/all");
      data.sort((a, b) => {
        return b.date - a.date;
      })
      setUrls(data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    loadUrls();
  }, []);

  return (
    <div className="container mt-5">
      <h1>URL Shortener</h1>
      <form onSubmit={(e) => onsubmit(e)}>
        <label>Enter URL Here:</label>
        <input
          value={url}
          type="text"
          onChange={(e) => onchange(e)}
          className="ml-2"
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
        <table className="table table-bordered mt-3">
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
