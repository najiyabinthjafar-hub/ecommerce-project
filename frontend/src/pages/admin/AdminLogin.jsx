import "./AdminLogin.css";

function AdminLogin() {
  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="login-brand">
          <h1>RIZO</h1>
          <p>Admin Panel</p>
        </div>

        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Login to manage your store</p>
        </div>

        <form>

          <div className="login-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="login-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminLogin;