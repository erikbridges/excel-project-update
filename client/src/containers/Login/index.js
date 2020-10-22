import React, { useState } from "react";
import { Link , withRouter } from "react-router-dom";
import "./CSS/style.css";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { Login } from "../../requests/requests"

const Index = function ({ history }) {
  // Form Handling with React Form Hooks
  const { register, handleSubmit, errors, reset } = useForm();
    // State
    const [state, setState] = useState({
      recaptchaValue: null,
      loading: false
    });
  function onChange(value) {
    setState({...state, recaptchaValue: value});
  }
  const loginUser = async (values) => {
    const recaptchaValue = state.recaptchaValue == null ? null : state.recaptchaValue;
    setState({...state, loading: true})
    try {
      // Check if Recaptcha is activated
      if (recaptchaValue == null) {
        throw new Error("Please complete the recaptcha challenge.")
      }
      // Send Login Admin Request on the backend
      const loginRequest = await Login({...values, recaptchaValue})
      if (loginRequest.success) {
         reset();
         // Alert the user
          setState({...state, loading: false, success: true})
         // Redirect the user
         return history.push("/")
      }
      console.log(values);

    } catch (ex) {
      console.log(ex)
      return  setState({...state, loading: false, error: true, errorMessage: ex.message})
    }
   
  };
  return (
    <div>
      <form className="login" onSubmit={handleSubmit(loginUser)}>
        <div className="login-header">
          <h1>Login</h1>
        </div>
          {state.error ? (<span style={{margin: 10, color: "red"}}>{state.errorMessage}</span>) : null}
        <div className="login-input-wrap">
          {errors.email || errors.password ? (
            <span className="error-message">Invalid Email or Password</span>
          ) : null}
          <label>Email</label>
          <input
            type="email"
            placeholder="email"
            name="email"
            ref={register({
              required: "Required",
            })}
          />
        </div>
        <div className="login-input-wrap">
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            name="password"
            ref={register({
              required: "Required",
            })}
          />
        </div>
        <div style={{ margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <ReCAPTCHA
              sitekey="6LeS0tgZAAAAAGZ3Rxm5X9KFzxWtDLIv3KlAj3l1"
              onChange={onChange}
            ></ReCAPTCHA>
          </div>
        </div>
        <div className="login-input-wrap forgot">
          <Link to="password-reset">Forgot Password?</Link>
        </div>
        <div className="login-input-wrap">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default withRouter(Index); 