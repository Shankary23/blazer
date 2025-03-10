import React, { useEffect, useState } from "react";
import "./news.css"; 

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3005/news")
      .then(response => response.json())
      .then(data => {
        setNews(data.slice(0, 10)); // Limit to 10 stories
      })
      .catch(error => console.error("Error fetching news:", error));
  }, []);

  return (
    <div className="news-container">
      <h2 className="news-header">Wildfire News</h2>
      <ul className="news-list">
        {news.map((article, index) => (
          <li key={index} className="news-item">
            <h3 className="news-title">{article.title}</h3>
            <p className="news-description">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-link"
            >
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
