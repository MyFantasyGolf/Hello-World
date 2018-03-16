import React from 'react';

const EntryPage = () => {
  return (
    <div className="golf-background">
      <div className="flex golf-banner">
        <div className="golf-icons-golf-tee big-icon"></div>
        <div className="fancy-font">MyFantasyGolf</div>
      </div>

      <div className="buttons flex">
        <div className="big-button fancy-font">
          Login
        </div>
        <div className="big-button fancy-font">
          Register
        </div>
      </div>
    </div>
  );
}

export default EntryPage;
