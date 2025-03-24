import React from 'react';
import AddPost from './components/AddPost'; // Formulář pro nový příspěvek
import Posts from './components/Posts';     // Seznam příspěvků
import './App.css';
import AddComment from './components/AddComment';

const App = () => {
    return (
        <div id="root">
            <h1> forum </h1>
            <div className="content-wrapper">
                <div className="new-post">
                    <h2>Vytvořit nový příspěvek</h2>
                    <AddPost />
                </div>

                <div className="posts-wrapper">
                    <Posts />
                </div>
            </div>
        </div>
    );
};

export default App;