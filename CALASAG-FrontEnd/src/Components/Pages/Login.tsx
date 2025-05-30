import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/no-bg-logo.png";

type UserRole = "super_admin" | "admin" | "user";

export const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [is2FAStep, setIs2FAStep] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>(""); // New state for Full Name
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Here you would typically make an API call to register the user
    alert("Registration successful! Please login.");
    setIsRegistering(false);
    // Clear all form fields
    setEmail("");
    setUsername("");
    setFullName(""); // Clear Full Name
    setPassword("");
    setConfirmPassword("");
    setMobileNumber("");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // For demo purposes, we'll simulate role verification
    const verifyUserRole = (username: string, password: string): UserRole => {
      if (username === "superadmin" && password === "superpass")
        return "super_admin";
      if (username === "admin" && password === "adminpass") return "admin";
      return "user";
    };

    const userRole = verifyUserRole(username, password);

    localStorage.setItem("userRole", userRole);

    if (userRole === "user") {
      setIs2FAStep(true);
      setCooldown(30);
    } else {
      if (userRole === "super_admin") {
        navigate("/super-admin-dashboard");
      } else if (userRole === "admin") {
        navigate("/admin-dashboard");
      }
    }

    setUsername("");
    setPassword("");
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handle2FASubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpCode.trim()) {
      alert("Please enter the verification code");
      return;
    }

    const userRole = localStorage.getItem("userRole") as UserRole;

    // Navigate based on role
    switch (userRole) {
      case "super_admin":
        navigate("/super-admin-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      default:
        navigate("/dashboard");
    }

    setOtpCode("");
  };

  const handleResendCode = () => {
    if (cooldown === 0) {
      alert("2FA code resent!");
      setCooldown(30);
    }
  };
  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 bg-[#f8eed4] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[30vh] lg:min-h-screen">
        <img src={logo} alt="CALASAG Logo" className="w-[32rem] sm:w-[40rem] md:w-[48rem] lg:w-[56rem] xl:w-[72rem] 2xl:w-[80rem] mb-4 sm:mb-6 lg:mb-8 max-w-full h-auto" />
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#005524] min-h-[70vh] lg:min-h-screen p-4">
        <form
          ref={formRef}
          className="bg-[#f8eed4] backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md border border-gray-800 text-[#005524]"
          onSubmit={
            is2FAStep
              ? handle2FASubmit
              : isRegistering
              ? handleRegisterSubmit
              : handleLoginSubmit
          }
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2 tracking-widest uppercase">
            {is2FAStep
              ? "One Time Password"
              : isRegistering
              ? "Register"
              : "Login"}
          </h1>
          <p className="text-xs text-[#bd4d22] text-center mb-6">
            {is2FAStep
              ? "Enter the code sent to your mobile number"
              : isRegistering
              ? "Create your CALASAG account"
              : "Secure Access to CALASAG"}
          </p>

          {!is2FAStep ? (
            <>
              {!isRegistering ? (
                <div className="mb-3 sm:mb-4">
                  <input
                    className="w-full bg-[#f8eed4] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-600 text-sm sm:text-base"
                    type="text"
                    placeholder="Email or Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-3 sm:mb-4">
                    <input
                      className="w-full bg-[#f8eed4] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-500 text-sm sm:text-base"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <input
                      className="w-full bg-[#f8eed4] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-500 text-sm sm:text-base"
                      type="text"
                      placeholder="Username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <input
                      className="w-full bg-[#f8eed4] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-500 text-sm sm:text-base"
                      type="text"
                      placeholder="Full Name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <input
                      className="w-full bg-[#f8eed4] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-500 text-sm sm:text-base"
                      type="tel"
                      placeholder="Mobile Number"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="mb-3 sm:mb-4">
                <input
                  className="w-full bg-[#f8eed4e8] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-500 text-sm sm:text-base"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {isRegistering && (
                <div className="mb-3 sm:mb-4">
                  <input
                    className="w-full bg-[#f8eed48e] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-500 text-sm sm:text-base"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              {!isRegistering && (
                <div className="flex items-center justify-between mb-4 sm:mb-6 text-xs sm:text-sm text-gray-400">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="accent-[#005524]" />
                    <span className="select-none">Remember me</span>
                  </label>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-3 sm:mb-4">
                <input
                  className="w-full bg-[#f8eed4] text-gray-800 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#005524] placeholder-gray-500 text-sm sm:text-base"
                  type="text"
                  placeholder="Enter OTP Code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={cooldown > 0}
                  className={`text-xs sm:text-sm text-[#005524] hover:text-[#005523c7] hover:underline ${
                    cooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Resend Code {cooldown > 0 ? `(${cooldown}s)` : ""}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIs2FAStep(false);
                    if (formRef.current) {
                      formRef.current.reset();
                    }
                  }}
                  className="text-xs sm:text-sm text-[#005524] hover:text-[#005523c7] hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-[#f9a01b] hover:bg-[#F9C835] text-white font-medium py-2 sm:py-3 rounded-lg transition duration-200 text-sm sm:text-base"
          >
            {is2FAStep ? "Verify Code" : isRegistering ? "Register" : "Login"}
          </button>

          {!is2FAStep && (
            <p className="text-xs sm:text-sm text-center mt-4 sm:mt-6 text-gray-800">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  if (formRef.current) {
                    formRef.current.reset();
                  }
                }}
                className="text-[#f9a01b] hover:text-[#F9C835] hover:underline ml-1"
              >
                {isRegistering ? "Login" : "Register"}
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
