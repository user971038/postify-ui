import React, { useState } from 'react';
import { useParams } from 'react-router';

const Profile = () => {
  const { userId } = useParams();
  const urlPosts = `http://localhost:8000/users/${userId}/posts`;
  console.log({ urlPosts });
  
  const { data, loading: _loading, error: _error } = useFetch(urlPosts);

  console.log(data);

  const [files, setFiles] = useState([]);

  const handleGetPost = (id) => {
    console.log(id);
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
  }

  const submitPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', 'Nuevo post');
    formData.append('user_id', userId);

    files.forEach((e) => {
      formData.append('files', e);
    })

    try {
      const res = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        body: formData
      });
      const post = await res.json();
      console.log(post);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="h-[80px] bg-green-500 gap-4">
        <div>Yo</div>
        <div>Followers</div>
        <div>Posts</div>
      </div>

      <div className="h-[560px] bg-pink-500 gap-4">
        <div className="h-[150px] w-[120px] bg-purple-500">
          {data.map((post) => (
            <div className="h-[150px] flex bg-red-800">{post.id}</div>
          ))}
        </div>
      </div>

      <div className="h-[80px] bg-blue-500 gap-4">
        <GoHome className="w-10 h-10" />
        <GoSearch className="w-10 h-10" />
        <GoBell className="w-10 h-10" />
        <GoMail className="w-10 h-10" />
        <GoCopilot className="w-10 h-10" />
      </div>

      <form name="uploadForm" onSubmit={submitPost}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <div>
          <input type="submit" value="Send File" />
        </div>
      </form>
    </div>
  );
}

export default Profile;