import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PasswordStrengthBar from "react-password-strength-bar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import "./CSS/style.css";
import ReCAPTCHA from "react-google-recaptcha";

// Requests
import { signUpAdmin } from "../../requests/requests";


export default function Index() {
  // Recaptcha Value
  const recaptchaRef = React.createRef();


  // Form Handling with React Form Hooks
  const { register, handleSubmit, errors, reset } = useForm();
  // State
  const [state, setState] = useState({
    hidden: true,
    error: false,
    password: "",
    cpassword: "",
    message: "",
    recaptchaValue: null,
    loading: false
  });

  // Toggle Visible Pass and Not Visible Pass
  const toggleHidden = () => setState({ hidden: !state.hidden });
  // Trace the password strength
  const tracePassword = (e) => setState({ password: e.target.value });

  function onChange(value) {
    setState({...state, recaptchaValue: value});
  }
  // Register User Request
  const registerUser = async (admin) => {
    setState({...state, loading: true,  error: false, message: ""});
    console.log(recaptchaRef.current)
    try {
      const recaptchaValue = state.recaptchaValue == null ? null : state.recaptchaValue;
      // Check if the password matches
      if (admin.cpassword !== admin.password) {
        throw new Error("Passwords do not match!")
      }

      if (recaptchaValue == null) {
        throw new Error("Please complete the recaptcha challenge.")
      }
      // Send Register Admin Request on the backend
      const registerAdmin = await signUpAdmin({...admin, recaptchaValue});
      if (registerAdmin.success) {
        // Alert the user
        return  setState({...state, loading: false, success: true, message: "Admin created successfully. Please login to the account and check your email to verify your account"})
      }
      reset();
     
    } catch (ex) {
      console.log(ex)

      setState({...state, error: true, loading: false, message: ex.message});
      return;
    }

  };
  return (
    <div>
      <form className="register" onSubmit={handleSubmit(registerUser)}>
        <div className="register-header">
          <h1>Register</h1>
          {state.success ? <span style={{color: "green"}}>{state.message}</span> : null}
        </div>
          {state.error ?   <span className="error-message">{state.message} </span> : null}
        <div className="register-input-wrap">
          {errors.email && errors.email.message ? (
            <span className="error-message">Invalid Email Address</span>
          ) : null}
          <label>Email</label>
          {/* // Check if the email has an @ (.com .org .net etc are allowed) */}
          <input
            type="email"
            placeholder="email"
            name="email"
            ref={register({
              required: "Required",
              pattern: {
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </div>
        <div className="register-input-wrap password-wrap">
          {/* Minimum eight characters max of 30, at least one letter, one number and one special character:
           */}
          {errors.password && errors.password.message ? (
            <span className="error-message">
              Invalid Password, 8 - 30 characters long, must contain a special
              character and a number.{" "}
            </span>
          ) : null}
          <label>Password</label>
          <div className="password-visible-wrap">
            <input
              type={state.hidden ? "password" : "text"}
              placeholder="password"
              name="password"
              onChange={(e) => tracePassword(e)}
              ref={register({
                required: "Required",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
                  message: "invalid password",
                },
              })}
            />
            {state.hidden == true ? (
              <div className="visible" onClick={() => toggleHidden()}>
                <FontAwesomeIcon icon={faEyeSlash} />
              </div>
            ) : (
              <div className="visible" onClick={() => toggleHidden()}>
                <FontAwesomeIcon icon={faEye} />
              </div>
            )}
          </div>
          <PasswordStrengthBar password={state.password} />
        </div>
        <div className="register-input-wrap">
          {errors.cpassword && errors.cpassword.message ? (
           <span className="error-message">
           The passwords do not match!
         </span>
          ) : null}
          <label>Confirm Password</label>
          <input type="cpassword" placeholder="confirm password" name="cpassword" ref={register({
                required: "Required"})} />
        </div>
        <div style={{ margin: "0 auto" }}>
          <div style={{ textAlign: "center" }}>
            <ReCAPTCHA
              sitekey="6LeS0tgZAAAAAGZ3Rxm5X9KFzxWtDLIv3KlAj3l1"
              onChange={onChange}
              ref={recaptchaRef}
            ></ReCAPTCHA>
          </div>
        </div>
        <div className="register-input-wrap">
          {state.loading ? (<button disabled>Loading...</button>) : (<button type="submit">Register</button>)}
          
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
