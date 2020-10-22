import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link, withRouter } from "react-router-dom";
import "./CSS/style.css";
import { useForm } from "react-hook-form";
import { updateAdmin, verifyCode, sendVerifyCode } from "../../requests/requests"
import delay from "delay";
import axios from "axios";


const Index = function ({ history })  {
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
    key: 0,
    recaptchaValue: null,
    loading: false, 
    success: true,
    verifyBtnLoading: false
  });
  const [data, setData] = useState({ data: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(
          'http://localhost:5000/api/load-excel',
          { headers: {"Authorization" : `Bearer ${localStorage.getItem("adminToken")}`} }
        );
       return setData(result.data)
      } catch (ex) {
        console.error(ex);
        history.push("/login");
      }
    };
 
    fetchData();
}, [])
  // Recaptcha Value
  const recaptchaRef = React.createRef();
  const onChange = (value) =>  setState({...state, recaptchaValue: value});

  // Change Admin Content
  const changeUserAdmin = async function (input) {   
    try {
      const recaptchaValue = state.recaptchaValue;
      console.log(input)
      if (input.password) {
        if (input.password !== input.cpassword) {
          // Passwords do not match throw an Error
          throw new Error("The passwords do not match!")
        }
      }
      if (!recaptchaValue) {
        throw new Error("Please complete the recaptcha challenge to continue.")
      }
      setState({...state, loading: true});
      const settingsUpdate = await updateAdmin({...input, recaptchaValue});
      if  (settingsUpdate.success) {
        reset();
        setState({...state, success: true, message: settingsUpdate.message, loading: false, error: false})
      }

    } catch (ex) {
      console.log(ex);
      setState({...state, error: true, message: ex.message, loading: false});
    } 
  }

  // Send New Verification Code
    const sendNewVerifyCode = async (e) => {
      e.preventDefault();
      try {
        setState({...state, verifyBtnLoading: true})
        const newCode = await sendVerifyCode();
        if (newCode.success) {
          setState({...state, success: true, verifyBtnLoading: true, error: false, message: "Check your email for a new verification code"});
          await delay(30000)
          return setState({...state, success: false, verifyBtnLoading: false})
        } 
       
      } catch (ex) {
        console.log(ex);
        return setState({...state, success: false, verifyBtnLoading: false, error: true, message: ex.message });
  
    }
  }

  // Verify Email Address
  const verifyEmail = async (input) => {    
    try {

      const recaptchaValue = state.recaptchaValue;
      if (!recaptchaValue) {
        throw new Error("Please complete the recaptcha challenge to continue.")
      }

      const verify = await verifyCode({...input, password: "", recaptchaValue});
      console.log(verify)
      if (verify.success) {
        setState({...state, success: true, message: "Email Successfully Verified"})
      }
    } catch (ex) {
      console.log(ex.message);
      return setState({...state, success: false, error: true, message: ex.message });
    }
  }
  return (
    
    <div className="settings">
      <h1>Settings</h1>  

      {state.error ?   <span className="error-message">{state.message} </span> : null}
      {state.success ?   <span style={{color: "green"}}>{state.message} </span> : null}
      
    <form onSubmit={handleSubmit(changeUserAdmin)}>
        <div className="settings-wrap">
          <div className="settings-title">
            <h3>Change Email</h3>
          </div>
          <input type="email" placeholder="email"  name="email"      
              ref={register({
                pattern: {
                  value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Enter a valid email address",
                }
              })}  />
        </div>
        <div className="settings-wrap">
          <div className="settings-title">
            <h3>Change Password</h3>
          </div>
          <input type="password" placeholder="password" name="password" ref={register({
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
                    message: "invalid password",
                  }
                })}/>
        </div>
        <div className="settings-wrap">
          <div className="settings-title">
            <h3>Confirm Password</h3>
          </div>
          <input type="password" placeholder="password" name="cpassword" ref={register()} />
        </div>
        <div className="settings-wrap">
    
          <div className="settings-button-wrap">
            <button type="submit">Submit</button>
          </div> 
        </div>
      </form>
      
      <form onSubmit={handleSubmit2(verifyEmail)} >
      {data.verified  == false ? (
           <div className="settings-wrap">
           <div className="settings-title">
             <h3>Verify Email</h3>
             <span>Enter code to verify your account.</span>
           </div>
           <div>
             <input type="text" placeholder="Enter Code" name="code" ref={register2({
                required: "Required"
             })} />
           </div>
         </div>
      ) : null}
     
        <div className="settings-title">
            <h3>Recaptcha</h3>
            <span>To make changes or verify please complete the recaptcha</span>
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
        <div className="settings-button-wrap">
        {data.verified == false  ? (
          <button type="submit">Submit</button>
        ) : null }
         
          <Link to="/">Go Back</Link>
        </div>
        {data.verified == false ? (
        <div className="settings-button-wrap">
          {state.verifyBtnLoading == true ? (
                <button disabled style={{opacity: .5}}> Please Wait... (30 Seconds)</button>
          ) : (
                <button onClick={(e) => sendNewVerifyCode(e)}>Send New Code</button>
          )}
      
        </div>
          ) : null }
      </form>
    </div>
  );
}

export default withRouter(Index);