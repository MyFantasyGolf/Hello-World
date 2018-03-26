import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const EntryPage = () => {
  return (
    <div className="golf-background">
      <div className="flex golf-banner">
        <div className="golf-icons-golf-tee big-icon"></div>
        <div className="fancy-font">MyFantasyGolf</div>
      </div>

      <div className="login">
        <div>
          <TextField
            id="email"
            placeholder="Email Address"
            required={true}
          >
          </TextField>
        </div>
        <div>
          <TextField
            id="password"
            placeholder="Password"
            require="true"
            type="password"
          >
          </TextField>
        </div>
        <div className="login-buttons">
          <Button variant="raised" color="primary">Login</Button>
        </div>
      </div>

{/*     <div className="buttons flex">
        <div className="big-button fancy-font">
          Login
        </div>
        <div className="big-button fancy-font">
          Register
        </div>
      </div>*/}
    </div>
  );
}

export default EntryPage;
