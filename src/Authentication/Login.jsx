import { useForm } from "react-hook-form";
import SocialLogin from "./socialLogin";
import UseAuth from "../hook/UseAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const { loginUser } = UseAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    loginUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Login Failed:", error.message);
      });
  };

  return (
    <>
      <style>{`
        /*
          DESKTOP  : AuthLayout handles the side-by-side split.
                     This component just fills its column normally.

          MOBILE (≤767px):
                     - Form block comes FIRST (top)
                     - Any sibling content from AuthLayout comes AFTER (below)
                     - Achieved by making this component a flex-col container
                       that stacks naturally in the document flow.
        */

        /* ── form wrapper ── */
        .lf-wrap {
          width: 100%;
        }

        .lf-title {
          font-size: 24px;
          font-weight: 700;
          color: #111;
          text-align: center;
          margin-bottom: 24px;
        }

        .lf-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── inputs ── */
        .lf-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #d1d5db;
          border-radius: 10px;
          font-size: 14px;
          color: #111;
          background: #fff;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          -webkit-appearance: none;
          box-sizing: border-box;
        }
        .lf-input::placeholder { color: #9ca3af; }
        .lf-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .lf-input-err { border-color: #f87171; }
        .lf-input-err:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

        .lf-err {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
        }

        /* ── submit button ── */
        .lf-btn {
          width: 100%;
          padding: 13px;
          background: #3b82f6;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background .2s, transform .15s;
          -webkit-appearance: none;
        }
        .lf-btn:hover { background: #2563eb; transform: translateY(-1px); }
        .lf-btn:active { transform: translateY(0); }

        /* ── register link ── */
        .lf-reg {
          font-size: 13px;
          color: #4b5563;
          text-align: center;
          margin-top: 12px;
        }
        .lf-reg a { color: #3b82f6; font-weight: 600; text-decoration: none; }
        .lf-reg a:hover { text-decoration: underline; }

        /* ── social ── */
        .lf-social { margin-top: 16px; }

        /* ════════════════════════════
           MOBILE  ≤ 767px
           Form first, rest below.
           The AuthLayout's "other column"
           will naturally render below this
           component in the DOM on mobile
           because AuthLayout should be
           flex-col on mobile.
        ════════════════════════════ */
        @media (max-width: 767px) {
          .lf-title { font-size: 22px; margin-bottom: 20px; }
          .lf-input  { padding: 11px 14px; font-size: 14px; }
          .lf-btn    { padding: 12px; font-size: 14px; }
        }

        @media (max-width: 400px) {
          .lf-title { font-size: 20px; }
        }
      `}</style>

      <div className="lf-wrap">
        <h2 className="lf-title">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="lf-form">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`lf-input${errors.email ? " lf-input-err" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
              })}
            />
            {errors.email && (
              <p className="lf-err">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`lf-input${errors.password ? " lf-input-err" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="lf-err">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="lf-btn">
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="lf-reg">
          Don't have an account?{" "}
          <a href="/register">Sign Up</a>
        </p>

        {/* Social Login */}
        <div className="lf-social">
          <SocialLogin />
        </div>
      </div>
    </>
  );
};

export default Login;