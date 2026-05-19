import React from 'react';
import { useParams } from 'react-router';

const Profile = () => {
  const { userId } = useParams();
  console.log('User ID:', userId);

  return (
    <div className="flex flex-col">
      <div className="h-[80px] bg-green-500 gap-4">
        <div>Yo</div>
        <div>Followers</div>
        <div>Posts</div>
      </div>

      <div className="h-[560px] bg-pink-500 gap-4">
        <div className="h-[150px] w-[120px] bg-purple-500"></div>
      </div>

      <div className="h-[80px] bg-blue-500 gap-4">
      </div>
    </div>
  );
}

export default Profile;