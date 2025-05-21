import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    mood: '',
    energy: '',
    wake_time: '',
    sleep_time: '',
    goal: '',
  });

  const [plan, setPlan] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/generate_plan/', formData);
      setPlan(res.data.plan);
    } catch (error) {
    console.error("Error connecting to backend:", error);

    if (error.response) {
      // Server responded with a status code outside 2xx
      setPlan(`Error: ${error.response.data.detail || error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      setPlan("Error: No response from server.");
    } else {
      // Something else happened
      setPlan("Error: Could not connect to backend.");
    }
  }
};

  return (
    <div className="App">
      <h1>My Day Planner</h1>
      <form onSubmit={handleSubmit}>
        <label>Mood:
          <input type="text" name="mood" value={formData.mood} onChange={handleChange} />
        </label><br />
        <label>Energy:
          <input type="text" name="energy" value={formData.energy} onChange={handleChange} />
        </label><br />
        <label>Wake Time:
          <input type="time" name="wake_time" value={formData.wake_time} onChange={handleChange} />
        </label><br />
        <label>Sleep Time:
          <input type="time" name="sleep_time" value={formData.sleep_time} onChange={handleChange} />
        </label><br />
        <label>Goal:
          <input type="text" name="goal" value={formData.goal} onChange={handleChange} />
        </label><br />
        <button type="submit">Generate Plan</button>
      </form>
      <div>
        <h2>Your Plan:</h2>
        <p>{plan}</p>
      </div>
    </div>
  );
}

export default App;
