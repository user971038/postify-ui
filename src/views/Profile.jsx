import React from 'react';
import { useParams } from 'react-router';

const Profile = () => {
  const { userId } = useParams();
  const urlPosts = `http://localhost:8000/users/${userId}/posts`;
  console.log({ urlPosts });
  
  const { data, loading, error } = useFetch(urlPosts);

  console.log(data);

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
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      </div>

      <div className="h-[80px] bg-blue-500 gap-4">
      </div>
    </div>
  );
}

export default Profile;