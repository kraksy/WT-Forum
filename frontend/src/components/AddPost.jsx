import React, { useState } from 'react';
import axios from 'axios';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            title,
            content,
        };

        axios
            .post('http://localhost:3000/api/posts', newPost)
            .then((response) => {
                // Můžete přidat logiku pro přesměrování nebo čistění formuláře
                console.log('Příspěvek byl vytvořen:', response.data);
            })
            .catch((error) => {
                console.error('Chyba při vytváření příspěvku:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Titul</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Zadejte název příspěvku"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="content">Obsah</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Zadejte obsah příspěvku"
                    required
                ></textarea>
            </div>

            <button type="submit">Vytvořit příspěvek</button>
        </form>
    );
};

export default AddPost;