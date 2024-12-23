import React, { useState } from 'react';

function App() {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [soundVolume, setSoundVolume] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset prediction and error states
    setPrediction(null);
    setError('');

    // Validate input data
    if (!temperature || !humidity || !soundVolume) {
      setError('All fields are required.');
      return;
    }

    // Prepare the data
    const sensorData = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      sound_volume: parseFloat(soundVolume),
    };

    try {
      // Send the request to the FastAPI backend
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensorData),
      });

      // Handle the response
      if (response.ok) {
        const data = await response.json();
        setPrediction(data.prediction);
      } else {
        setError('Failed to get a valid response from the server.');
      }
    } catch (error) {
      setError('Error connecting to the server.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Anomaly Detection</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Temperature</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Humidity</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Sound Volume</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              value={soundVolume}
              onChange={(e) => setSoundVolume(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>

        {/* Display the result */}
        {prediction !== null && (
          <div className={`mt-4 p-4 rounded ${prediction === 1 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}>
            {prediction === 1 ? 'Anomalous' : 'Normal'}
          </div>
        )}

        {/* Display any errors */}
        {error && (
          <div className="mt-4 p-4 rounded bg-red-100 text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
