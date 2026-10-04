import "../styles/login.css";

function InputField({ label, type, id,placeholder }) {
  return (
    <div className="userInfo">
      <label htmlFor={id}>{label}</label>
      <br />
      <input type={type} id={id} placeholder={placeholder} className="userInput" />
    </div>
  );
}

function App() {
  return (
    <>
      <div id="acount_dialog">
        <h2>Welcome, homie.</h2>

        <div id="account_form">
          <InputField label="Username" type="text" id="userName" placeholder="What should we call you?"/>
          <InputField label="Password" type="password" id="userPassword" placeholder="Enter your password"/>
        </div>
      </div>
    </>
  );
}

export default App;
