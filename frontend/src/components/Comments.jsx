import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddComment from './AddComment';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:3000/api/comments/${postId}`)
            .then((response) => {
                setComments(response.data);
            })
            .catch((error) => {
                console.error('Chyba při načítání komentářů:', error);
            });
    }, [postId]);

    return (
        <div>
            <h3>Komentáře</h3>
            <AddComment postId={postId} />
            {comments.map((comment) => (
                <div key={comment.id}>
                    <p>{comment.content}</p>
                    <p>{comment.created_at}</p>
                </div>
            ))}
        </div>
    );
};

export default Comments;