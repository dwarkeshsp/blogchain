import React, { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <LinkPreview />
    </div>
  );
}

function LinkPreview() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [valid, setValid] = useState(true);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const validURL = () =>
      url.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi
      );

    if (validURL(url)) {
      setLoading(true);
      const encoding = Buffer.from(url).toString("base64");

      console.log(`Submitting ${url}`, "encoded as", encoding);

      const res = await fetch(
        "https://us-central1-blogchain-a6eac.cloudfunctions.net/scraper",
        {
          method: "POST",
          body: JSON.stringify({ encoding }),
        }
      );

      const data = await res.json();

      setData(data);
      setLoading(false);
    } else {
      setValid(false);
    }
  };

  return (
    <div>
      <h1>Form</h1>
      Try this:{" "}
      <pre>
        some example text https://fireship.io and
        https://fireship.io/courses/javascript/
      </pre>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          cols="50"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
        <br />
        {!valid && "Url is not valid. Make sure to include http(s)://"}
      </form>
      <h2>Preview</h2>
      <p>{url}</p>
      {loading && <h3>Fetching link previews... 🤔🤔🤔</h3>}
      {data && <PreviewCard key={data.url} linkData={data} />}
    </div>
  );
}

function PreviewCard({ linkData }) {
  return (
    <div>
      <a className="preview" href={linkData.url}>
        {/* <img src={linkData.image} /> */}
        {/* <div> */}
        <h4>{linkData.title}</h4>
        {/* <p>{linkData.description}</p> */}

        {/* </div> */}
      </a>
      {linkData.text.map((p) => (
        <p>{p}</p>
      ))}
    </div>
  );
}

export default App;
