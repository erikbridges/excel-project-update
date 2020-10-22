import React , {useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import delay from "delay";
import "./CSS/style.css";
import { sendForgotCode, verifyCode } from "../../requests/requests"

export default function Index() {
   // Form Handling with React Form Hooks
   const { register, handleSubmit, errors, reset } = useForm();
   const {
    register: register2,
    reset: reset2,
    handleSubmit: handleSubmit2
  } = useForm();
  // State
  const [state, setState] = useState({
    hidden: true,
    error: false,
    message: "",
    recaptchaValue: null,
    sendCodeLoad: false, 
    success: true
  });

  const onChange = (value) =>  setState({...state, recaptchaValue: value});
  
  const sendVerifyCode = async (input) => {
   setState({...state, error: false, sendCodeLoad: true, message: ""});
   try {
    // Verify Passcode Request
    let newCode = await sendForgotCode(input.email)
    // Send Verification Code To Admin Email if it exists
    if (newCode.success) {
      setState({...state, success: true, message: newCode.message, sendCodeLoad: true, error: false})
       // Create a timeout (30 seconds)
      reset();
      await delay(30000);
      return setState({...state, loading: false, sendCodeLoad: false, error: false})
    } else {
      throw new Error ("An unexpected error has occurred.")
    }
   } catch (ex) {
     console.error(ex)
     setState({...state, error: true, success: false, sendCodeLoad: false, message: ex.message});

   }
 }

  const verifyPasscode = async (input) => {
    try {
      if (input.password !== input.cpassword) {
        // Passwords do not match throw an Error
        throw new Error("The passwords do not match!")
      }
        // Recaptcha 
        const recaptchaValue = state.recaptchaValue == null ? null : state.recaptchaValue;

        if (recaptchaValue == null) {
          throw new Error("Please complete the recaptcha challenge.")
        }
       const changePassword =  await verifyCode({...input, recaptchaValue});

       if (changePassword.success) {
        setState({...state, success: true, message: "Password has been sucessfully changed" });
       }
    } catch (ex) {
      console.error(ex.message)
      setState({...state, error: true, success: false, loading: false, message: ex.message});

    }
    
  }


  return (
    <div>
      <div className="reset-pass">
        <div className="reset-pass-box">
          <h2>Forgot Password?</h2>
          <p>
            No problem! We can reset a password for you by entering your email
            address and copying and pasting a delivered passcode here.
          </p>
        </div>
        {state.success ? <span style={{color: "green"}}>{state.message}</span> : null}
    <div>
      <form className="reset-pass-input-wrap" onSubmit={handleSubmit(sendVerifyCode)}>
        {state.error ?   <span className="error-message">{state.message} </span> : null}
        {errors.email && errors.email.message ? (
            <span className="error-message">Please, enter a valid email</span>
          ) : null}
          <label>Email</label>
          <input type="email" placeholder="email" name="email"  ref={register({
              required: "Required",
              pattern: {
                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Enter a valid email address",
              },
            })} />
            {state.sendCodeLoad == true ? (
              <button disabled style={{opacity: .5}} className="btn-reset-code">Please wait...(30 Seconds)</button>

            ) : (
              <button type="submit" className="btn-reset-code">Send Code</button>
            )}
      </form>
      </div>
        <form onSubmit={handleSubmit2(verifyPasscode)}>
          <div className="reset-pass-input-wrap">
            <label>Passcode</label>
            <input type="text" placeholder="passcode" name="passcode"  ref={register2({
              required: "Required"
            })} />
          </div>
          <div className="reset-pass-input-wrap">
            <label>New Password</label>
            <input type="password" placeholder="New Password" name="password" ref={register2({
              required: "Required",
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
                message: "invalid password",
              },
            })} />
          </div>
          <div className="reset-pass-input-wrap">
            <label>Comfirm</label>
            <input type="password" name="cpassword" placeholder="Confirm New Password" ref={register2({
              required: "Required"
            })} />
          </div>
          <div className="reset-pass-input-wrap">
            <label>Recaptcha Verify</label>
            <div style={{ margin: "0 auto" }}>
              <div style={{ textAlign: "center" }}>
                <ReCAPTCHA
                  sitekey="6LeS0tgZAAAAAGZ3Rxm5X9KFzxWtDLIv3KlAj3l1"
                  onChange={onChange}
                ></ReCAPTCHA>
              </div>
            </div>
          </div>
          <div className="reset-pass-btn-wrap">
            <button type="submit">Reset Password</button>
            <Link to="/login">Go Back</Link>
          </div>
        </form>
      
      </div>
    </div>
  );
}
