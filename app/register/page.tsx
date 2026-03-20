"use client";

// DEBUG: Removed 'headers' import (Server-only) and added 'useRouter'
import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';

function RegisterPage() {
  const router = useRouter(); // DEBUG: Initialized router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log(data);
      router.push("/login"); // DEBUG: Now works because router is defined
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder='Email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder='Password' 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder='Confirm password' 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        <button type='submit'>Register</button>
      </form>
      <div>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default RegisterPage;


//react-query
//loading state
//error handling
//debounce