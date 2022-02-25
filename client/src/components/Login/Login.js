import React from "react";
import { Helmet } from "react-helmet";
import "./Login.css";

const Login = () => {
  return (
    <>
      <Helmet>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
        <meta
          name="google-signin-client_id"
          content="105652807115-eak77gaha5pmfj9cd6vr7792smlqdff4.apps.googleusercontent.com"
        ></meta>
      </Helmet>
      <h1>Login</h1>
      <div class="g-signin2" data-onsuccess="onSignIn"></div>
      <script>
        {function onSignIn(googleUser) {
          var profile = googleUser.getBasicProfile();
          console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
          console.log("Name: " + profile.getName());
          console.log("Image URL: " + profile.getImageUrl());
          console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
        }}
      </script>
    </>
  );
};

export default Login;
