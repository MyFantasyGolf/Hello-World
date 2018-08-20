import React from 'react';
import UserBox from './UserBox';

const Banner = () => {
  return (
    <div className="banner-parent">
      <div className="left golf-icons-golf-tee">
      </div>
      <div className="title">MyFantasyGolf</div>
      <UserBox className="user-box"/>
    </div>
  );
};

export default Banner;
