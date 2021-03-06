import classes from "../SigninPage.module.css"

export const SignupComponent = ({
  signupSubmit,
  userName,
  signinPageDispatch,
  userNameValid,
  email,
  emailValid,
  password,
  authLoading,
  passwordValid,
}) => {
  return (
    <>
      <h1>Sign Up:</h1>
      <form className={classes["signup-container"]} onSubmit={signupSubmit}>
        <div>
          <input
            type="text"
            className={classes["textbox"]}
            placeholder="Username"
            required
            value={userName}
            onChange={(event) =>
              signinPageDispatch({
                type: "ADD_USERNAME",
                payload: event.target.value,
              })
            }
          />
          {!userNameValid && (
            <p className={classes["error-text"]}>
              Please enter a valid user name
            </p>
          )}
        </div>
        <div>
          <input
            type="email"
            className={classes["textbox"]}
            placeholder="Email"
            required
            value={email}
            onChange={(event) =>
              signinPageDispatch({
                type: "ADD_EMAIL",
                payload: event.target.value,
              })
            }
          />
          {!emailValid && (
            <p className={classes["error-text"]}>Please enter a valid email</p>
          )}
        </div>
        <input
          type="password"
          className={classes["textbox"]}
          placeholder="Password"
          required
          value={password}
          onChange={(event) =>
            signinPageDispatch({
              type: "ADD_PASSWORD",
              payload: event.target.value,
            })
          }
        />
        {!passwordValid && (
          <p className={classes["error-text"]}>
            Password should be atleast 8 characters with atleast 1 number
          </p>
        )}
        <button
          type="submit"
          className={`${classes["button-solid"]} ${classes["button-primary"]}`}
          disabled={authLoading}
        >
          Sign up!
        </button>
      </form>
    </>
  );
};