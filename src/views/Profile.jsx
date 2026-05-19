import React from 'react';
import { useParams } from 'react-router';

const Profile = () => {
  const { userId } = useParams();
  console.log('User ID:', userId);
  
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}

export default Profile;