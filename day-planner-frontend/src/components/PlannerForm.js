import React, { useState } from 'react';

function PlannerForm() {
  const [formData, setFormData] = useState({
    mood: '',
    energy: '',
    wake_time: '',
    sleep_time: '',
    goal: ''
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/plan_day`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    setResult(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Mood:
          <input type="text" name="mood" value={formData.mood} onChange={handleChange} />
        </label><br/>
        <label>Energy:
          <input type="text" name="energy" value={formData.energy} onChange={handleChange} />
        </label><br/>
        <label>Wake Time:
          <input type="time" name="wake_time" value={formData.wake_time} onChange={handleChange} />
        </label><br/>
        <label>Sleep Time:
          <input type="time" name="sleep_time" value={formData.sleep_time} onChange={handleChange} />
        </label><br/>
        <label>Goal:
          <input type="text" name="goal" value={formData.goal} onChange={handleChange} />
        </label><br/>
        <button type="submit">Plan Day</button>
      </form>

      {result && (
        <div>
          <h3>Your Planned Day:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default PlannerForm;
