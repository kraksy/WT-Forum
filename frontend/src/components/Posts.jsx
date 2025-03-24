import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState('time'); // Default sort by time

    useEffect(() => {
        axios
            .get(`http://localhost:3000/api/posts?sortBy=${sortBy}`)
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('Chyba při načítání příspěvků:', error);
            });
    }, [sortBy]);

    return (
        <div className="posts-container">
            <h1>Příspěvky</h1>
            <div className="sort-buttons">
                <button onClick={() => setSortBy('time')}>Seřadit podle času</button>
                <button onClick={() => setSortBy('comments')}>Seřadit podle počtu komentářů</button>
            </div>

            {posts.map((post) => (
                <div key={post.id} className="post">
                    <p className='icon'> </p>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <p className="meta">Vytvořeno: {new Date(post.created_at).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};

export default Posts;