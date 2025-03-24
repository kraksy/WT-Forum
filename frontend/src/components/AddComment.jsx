import React, { useState } from 'react';
import axios from 'axios';

const AddComment = ({ postId }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:3000/api/comments', { post_id: postId, content })
            .then((response) => {
                console.log('Komentář přidán:', response.data);
                setContent('');
            })
            .catch((error) => {
                console.error('Chyba při přidávání komentáře:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Komentář:
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>
            </label>
            <button type="submit">Přidat komentář</button>
        </form>
    );
};

export default AddComment;